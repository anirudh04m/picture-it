const express = require('express');
const { check, validationResult } = require('express-validator');
const Guess = require('../models/Guess');
const Photo = require('../models/Photo');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/guesses
// @desc    Submit a location guess
// @access  Private
router.post('/', auth, [
  check('photoId', 'Photo ID is required').not().isEmpty(),
  check('guessedLocation.country', 'Country is required').not().isEmpty(),
  check('guessedLocation.city', 'City is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { photoId, guessedLocation, timeToGuess } = req.body;

  try {
    // Check if user already guessed this photo
    const existingGuess = await Guess.findOne({
      user: req.user.id,
      photo: photoId
    });

    if (existingGuess) {
      return res.status(400).json({ message: 'You have already guessed this photo' });
    }

    // Get the photo with actual location
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if photo is still active
    if (!photo.isActive || photo.expiresAt < new Date()) {
      return res.status(400).json({ message: 'This photo is no longer available for guessing' });
    }

    // Check if user is guessing their own photo
    if (photo.user.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot guess your own photo' });
    }

    // Determine if guess is correct
    const isCorrect = 
      guessedLocation.country.toLowerCase() === photo.actualLocation.country.toLowerCase() &&
      guessedLocation.city.toLowerCase() === photo.actualLocation.city.toLowerCase();

    // Calculate points based on difficulty and time
    let pointsEarned = 0;
    if (isCorrect) {
      const basePoints = photo.points;
      const timeBonus = timeToGuess < 30 ? 5 : timeToGuess < 60 ? 3 : 1;
      pointsEarned = basePoints + timeBonus;
    }

    // Create the guess
    const guess = new Guess({
      user: req.user.id,
      photo: photoId,
      guessedLocation,
      isCorrect,
      pointsEarned,
      timeToGuess: timeToGuess || 0
    });

    await guess.save();

    // Update photo statistics
    await Photo.findByIdAndUpdate(photoId, {
      $inc: {
        totalGuesses: 1,
        correctGuesses: isCorrect ? 1 : 0
      }
    });

    // Update user statistics and points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        totalGuesses: 1,
        correctGuesses: isCorrect ? 1 : 0,
        points: pointsEarned
      }
    });

    res.json({
      guess,
      isCorrect,
      pointsEarned,
      actualLocation: photo.actualLocation
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/guesses/my-guesses
// @desc    Get user's guess history
// @access  Private
router.get('/my-guesses', auth, async (req, res) => {
  try {
    const guesses = await Guess.find({ user: req.user.id })
      .populate('photo', 'title imageUrl user')
      .populate('photo.user', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(guesses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/guesses/photo/:photoId
// @desc    Get all guesses for a specific photo (for photo owner)
// @access  Private
router.get('/photo/:photoId', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if user owns the photo
    if (photo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const guesses = await Guess.find({ photo: req.params.photoId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(guesses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 
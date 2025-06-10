const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { check, validationResult } = require('express-validator');
const Photo = require('../models/Photo');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret'
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Points mapping based on difficulty
const difficultyPoints = {
  easy: 5,
  medium: 10,
  hard: 15
};

// @route   POST /api/photos/upload
// @desc    Upload a new photo
// @access  Private
router.post('/upload', auth, upload.single('image'), [
  check('title', 'Title is required').not().isEmpty(),
  check('actualLocation.country', 'Country is required').not().isEmpty(),
  check('actualLocation.city', 'City is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  try {
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'picture-it',
          transformation: [
            { width: 800, height: 600, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Determine points based on difficulty
    const difficulty = req.body.difficulty || 'medium';
    const points = difficultyPoints[difficulty] || 10;

    const photo = new Photo({
      user: req.user.id,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      title: req.body.title,
      description: req.body.description || '',
      actualLocation: {
        country: req.body.actualLocation.country,
        city: req.body.actualLocation.city,
        coordinates: req.body.actualLocation.coordinates || {}
      },
      difficulty: difficulty,
      points: points
    });

    await photo.save();

    // Update user's photos uploaded count
    await require('../models/User').findByIdAndUpdate(
      req.user.id,
      { $inc: { photosUploaded: 1 } }
    );

    res.json(photo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/photos
// @desc    Get all active photos for guessing
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get photos that the user has already guessed
    const Guess = require('../models/Guess');
    const userGuesses = await Guess.find({ user: req.user.id }).select('photo');
    const guessedPhotoIds = userGuesses.map(guess => guess.photo);

    // Find photos that are active, not expired, not user's own, and not already guessed
    const photos = await Photo.find({
      isActive: true,
      expiresAt: { $gt: new Date() },
      user: { $ne: req.user.id }, // Exclude user's own photos
      _id: { $nin: guessedPhotoIds } // Exclude photos user has already guessed
    })
    .populate('user', 'username avatar')
    .select('-actualLocation') // Don't send actual location to client
    .sort({ createdAt: -1 })
    .limit(20);

    res.json(photos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/photos/my-photos
// @desc    Get user's own photos
// @access  Private
router.get('/my-photos', auth, async (req, res) => {
  try {
    const photos = await Photo.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(photos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/photos/:id
// @desc    Get photo by ID (without actual location for guessing)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('user', 'username avatar')
      .select('-actualLocation');

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.json(photo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/photos/:id
// @desc    Delete a photo
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if user owns the photo
    if (photo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    await photo.deleteOne();

    // Update user's photos uploaded count
    await require('../models/User').findByIdAndUpdate(
      req.user.id,
      { $inc: { photosUploaded: -1 } }
    );

    res.json({ message: 'Photo removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select('username points correctGuesses totalGuesses photosUploaded avatar')
      .sort({ points: -1, correctGuesses: -1 })
      .limit(50);

    res.json(leaderboard);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, avatar } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      points: user.points,
      avatar: user.avatar,
      correctGuesses: user.correctGuesses,
      totalGuesses: user.totalGuesses,
      photosUploaded: user.photosUploaded
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('points correctGuesses totalGuesses photosUploaded');

    const accuracy = user.totalGuesses > 0 
      ? Math.round((user.correctGuesses / user.totalGuesses) * 100) 
      : 0;

    res.json({
      ...user.toObject(),
      accuracy
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 
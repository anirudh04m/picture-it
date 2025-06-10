const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { time } = req.query;
    let dateFilter = {};

    // Apply time filter if specified
    if (time === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateFilter.createdAt = { $gte: oneWeekAgo };
    } else if (time === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateFilter.createdAt = { $gte: oneMonthAgo };
    }

    const leaderboard = await User.find(dateFilter)
      .select('username points correctGuesses totalGuesses photosUploaded avatar createdAt')
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
    const { username, email, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      points: user.points,
      avatar: user.avatar,
      correctGuesses: user.correctGuesses,
      totalGuesses: user.totalGuesses,
      photosUploaded: user.photosUploaded,
      createdAt: user.createdAt
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accuracy = user.totalGuesses > 0 
      ? Math.round((user.correctGuesses / user.totalGuesses) * 100) 
      : 0;

    res.json({
      totalPoints: user.points,
      correctGuesses: user.correctGuesses,
      totalGuesses: user.totalGuesses,
      photosUploaded: user.photosUploaded,
      accuracy
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 
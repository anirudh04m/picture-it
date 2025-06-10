const mongoose = require('mongoose');

const guessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: true
  },
  guessedLocation: {
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  timeToGuess: {
    type: Number, // in seconds
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate guesses
guessSchema.index({ user: 1, photo: 1 }, { unique: true });

module.exports = mongoose.model('Guess', guessSchema); 
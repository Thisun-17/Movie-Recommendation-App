const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only rate a movie once
RatingSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);
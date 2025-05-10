const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  poster: {
    type: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a movie appears once in a user's watchlist
WatchlistSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);
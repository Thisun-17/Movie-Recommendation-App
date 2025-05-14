const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  searchMovies,
  getTrendingMovies,
  getMovieDetails,
  rateMovie,
  getUserRatings,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  getRecommendations
} = require('../controllers/movieController');

// Public routes
router.get('/search', searchMovies);
router.get('/trending', getTrendingMovies);

// Protected routes
router.get('/user/ratings', protect, getUserRatings);
router.get('/user/watchlist', protect, getWatchlist);
router.get('/user/recommendations', protect, getRecommendations);

// Routes with path parameters
router.get('/:id', getMovieDetails);
router.post('/:id/rate', protect, rateMovie);
router.post('/:id/watchlist', protect, addToWatchlist);
router.delete('/:id/watchlist', protect, removeFromWatchlist);

module.exports = router;
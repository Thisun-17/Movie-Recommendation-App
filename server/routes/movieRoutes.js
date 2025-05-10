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
router.get('/:id', getMovieDetails);

// Protected routes
router.post('/:id/rate', protect, rateMovie);
router.get('/user/ratings', protect, getUserRatings);
router.post('/:id/watchlist', protect, addToWatchlist);
router.delete('/:id/watchlist', protect, removeFromWatchlist);
router.get('/user/watchlist', protect, getWatchlist);
router.get('/user/recommendations', protect, getRecommendations);

module.exports = router;
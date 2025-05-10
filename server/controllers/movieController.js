const axios = require('axios');
const Rating = require('../models/Rating');
const Watchlist = require('../models/Watchlist');

// Base URL for TMDB API
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make TMDB API requests
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error(`TMDB API Error: ${error.message}`);
    throw error;
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const data = await tmdbRequest('/search/movie', { query });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res) => {
  try {
    const { time_window = 'week' } = req.query; // day or week
    const data = await tmdbRequest(`/trending/movie/${time_window}`);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbRequest(`/movie/${id}`);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Rate a movie
// @route   POST /api/movies/:id/rate
// @access  Private
const rateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;
    
    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ message: 'Rating must be between 1 and 10' });
    }
    
    // Check if movie exists in TMDB
    try {
      await tmdbRequest(`/movie/${id}`);
    } catch (error) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Create or update rating
    const ratingDoc = await Rating.findOneAndUpdate(
      { user: userId, movieId: id },
      { rating },
      { new: true, upsert: true }
    );
    
    res.json(ratingDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's movie ratings
// @route   GET /api/movies/ratings
// @access  Private
const getUserRatings = async (req, res) => {
  try {
    const userId = req.user._id;
    const ratings = await Rating.find({ user: userId });
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/movies/:id/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Get movie details from TMDB
    try {
      const movie = await tmdbRequest(`/movie/${id}`);
      
      // Add to watchlist
      const watchlistItem = await Watchlist.findOneAndUpdate(
        { user: userId, movieId: id },
        { 
          title: movie.title,
          poster: movie.poster_path
        },
        { new: true, upsert: true }
      );
      
      res.json(watchlistItem);
    } catch (error) {
      return res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/movies/:id/watchlist
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const result = await Watchlist.findOneAndDelete({ user: userId, movieId: id });
    
    if (result) {
      res.json({ message: 'Movie removed from watchlist' });
    } else {
      res.status(404).json({ message: 'Movie not found in watchlist' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's watchlist
// @route   GET /api/movies/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const watchlist = await Watchlist.find({ user: userId });
    res.json(watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get movie recommendations based on user ratings
// @route   GET /api/movies/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's highly rated movies (rating >= 7)
    const userRatings = await Rating.find({ user: userId, rating: { $gte: 7 } });
    
    if (userRatings.length === 0) {
      // If no ratings, return popular movies
      const popular = await tmdbRequest('/movie/popular');
      return res.json(popular);
    }
    
    // Get recommendations based on a randomly selected highly rated movie
    const randomRating = userRatings[Math.floor(Math.random() * userRatings.length)];
    const recommendations = await tmdbRequest(`/movie/${randomRating.movieId}/recommendations`);
    
    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  searchMovies,
  getTrendingMovies,
  getMovieDetails,
  rateMovie,
  getUserRatings,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  getRecommendations
};
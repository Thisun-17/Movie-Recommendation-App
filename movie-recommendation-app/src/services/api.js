import axios from 'axios';

// Create an instance of axios with a base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to set the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Movie related API calls
export const movieApi = {
  search: (query) => api.get(`/movies/search?query=${query}`),
  getTrending: () => api.get('/movies/trending'),
  getDetails: (id) => api.get(`/movies/${id}`),
  rateMovie: (id, rating) => api.post(`/movies/${id}/rate`, { rating }),
  getUserRatings: () => api.get('/movies/user/ratings'),
  addToWatchlist: (id) => api.post(`/movies/${id}/watchlist`),
  removeFromWatchlist: (id) => api.delete(`/movies/${id}/watchlist`),
  getWatchlist: () => api.get('/movies/user/watchlist'),
  getRecommendations: () => api.get('/movies/user/recommendations')
};

// User related API calls
export const userApi = {
  register: (userData) => api.post('/users', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile')
};

export default api;

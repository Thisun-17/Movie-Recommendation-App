const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Import routes
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Movie Recommendation API is running');
});

// Error handling middleware - must be after route definitions
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// backend/src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createClient } = require('redis');
const logger = require('./config/logger');
const userRoutes = require('./routes/userRoutes');
const footprintRoutes = require('./routes/footprintRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greenprint', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('MongoDB connected'))
.catch(err => logger.error('MongoDB connection error:', err));

// Redis setup
let redisClient = null;
const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    await redisClient.connect();
    logger.info('Redis connected');
  } catch (error) {
    logger.error('Redis connection error:', error);
  }
};

// Connect to Redis
connectRedis();

// Make redisClient available to routes
app.use((req, res, next) => {
  req.redisClient = redisClient;
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/footprint', footprintRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
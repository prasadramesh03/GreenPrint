// backend/src/controllers/recommendationController.js
const Recommendation = require('../models/recommendationModel');
const Footprint = require('../models/footprintModel');
const logger = require('../config/logger');

// @desc    Get all recommendations
// @route   GET /api/recommendations
// @access  Public
exports.getAllRecommendations = async (req, res) => {
  try {
    // Query parameters
    const category = req.query.category;
    const difficulty = req.query.difficulty;
    const limit = parseInt(req.query.limit) || 20;
    
    // Build query
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    // Cache key
    const cacheKey = `recommendations:${category || 'all'}:${difficulty || 'all'}:${limit}`;
    
    // Check cache
    if (req.redisClient) {
      const cachedData = await req.redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json({
          success: true,
          count: JSON.parse(cachedData).length,
          recommendations: JSON.parse(cachedData),
          cached: true
        });
      }
    }

    // Fetch from DB if not cached
    const recommendations = await Recommendation.find(query).limit(limit);

    // Store in cache
    if (req.redisClient) {
      await req.redisClient.set(cacheKey, JSON.stringify(recommendations), { EX: 3600 }); // 1 hour expiry
    }

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    logger.error('Get all recommendations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get personalized recommendations
// @route   GET /api/recommendations/personalized
// @access  Private
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    let latestFootprint;

    // Check cache for latest footprint
    if (req.redisClient) {
      const cachedFootprint = await req.redisClient.get(`user:${req.user._id}:latest-footprint`);
      if (cachedFootprint) latestFootprint = JSON.parse(cachedFootprint);
    }

    // Fetch from DB if not cached
    if (!latestFootprint) {
      latestFootprint = await Footprint.findOne({ user: req.user._id }).sort({ date: -1 });
    }

    if (!latestFootprint) {
      return res.status(404).json({ success: false, message: 'No footprint found. Please calculate your footprint first.' });
    }

    // Identify the highest emitting category
    const { transportation, home, food } = latestFootprint.results.breakdown;
    const highestEmissionSource = Math.max(transportation, home, food);

    let priorityCategory;
    if (highestEmissionSource === transportation) priorityCategory = 'transportation';
    else if (highestEmissionSource === home) priorityCategory = 'home';
    else priorityCategory = 'food';

    // Fetch personalized recommendations
    const personalizedRecommendations = await Recommendation.find({ category: priorityCategory }).limit(5);
    const generalRecommendations = await Recommendation.find({ category: 'general' }).limit(3);

    res.status(200).json({
      success: true,
      count: personalizedRecommendations.length + generalRecommendations.length,
      recommendations: [...personalizedRecommendations, ...generalRecommendations],
      priorityArea: priorityCategory
    });
  } catch (error) {
    logger.error('Get personalized recommendations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a recommendation (Admin only)
// @route   POST /api/recommendations
// @access  Private/Admin
exports.createRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.create(req.body);

    // Invalidate cache
    if (req.redisClient) {
      const keys = await req.redisClient.keys('recommendations:*');
      if (keys.length > 0) await req.redisClient.del(keys);
    }

    res.status(201).json({ success: true, recommendation });
  } catch (error) {
    logger.error('Create recommendation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a recommendation (Admin only)
// @route   PUT /api/recommendations/:id
// @access  Private/Admin
exports.updateRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    // Invalidate cache
    if (req.redisClient) {
      const keys = await req.redisClient.keys('recommendations:*');
      if (keys.length > 0) await req.redisClient.del(keys);
    }

    res.status(200).json({ success: true, recommendation });
  } catch (error) {
    logger.error('Update recommendation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a recommendation (Admin only)
// @route   DELETE /api/recommendations/:id
// @access  Private/Admin
exports.deleteRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndDelete(req.params.id);

    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    // Invalidate cache
    if (req.redisClient) {
      const keys = await req.redisClient.keys('recommendations:*');
      if (keys.length > 0) await req.redisClient.del(keys);
    }

    res.status(200).json({ success: true, message: 'Recommendation deleted successfully' });
  } catch (error) {
    logger.error('Delete recommendation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

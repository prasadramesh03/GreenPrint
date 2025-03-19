// backend/src/controllers/footprintController.js
const Footprint = require('../models/footprintModel');
const logger = require('../config/logger');
const axios = require('axios');

// Helper function to calculate emissions
const calculateEmissions = (data) => {
  try {
    // These are simplified calculations for demonstration
    // In a real app, you would use more accurate formulas or an API
    
    // Transportation calculations
    const transportationEmissions = 
      (data.transportation.carMileage * (data.transportation.carType === 'gasoline' ? 0.35 : 0.2)) +
      (data.transportation.publicTransport * 0.15) +
      (data.transportation.flights * 1200);
    
    // Home energy calculations
    const homeEmissions = 
      (data.home.electricityUsage * 0.4) +
      (data.home.gasUsage * 0.5) / data.home.peopleInHousehold;
    
    // Food calculations
    let foodEmissions = 1500; // Default for mixed diet
    
    if (data.food.dietType === 'meat') {
      foodEmissions = 2000;
    } else if (data.food.dietType === 'vegetarian') {
      foodEmissions = 1200;
    } else if (data.food.dietType === 'vegan') {
      foodEmissions = 1000;
    }
    
    // Adjust for food waste
    if (data.food.foodWaste === 'high') {
      foodEmissions *= 1.2;
    } else if (data.food.foodWaste === 'low') {
      foodEmissions *= 0.9;
    }
    
    // Total emissions
    const totalEmissions = transportationEmissions + homeEmissions + foodEmissions;
    
    return {
      totalEmissions,
      breakdown: {
        transportation: transportationEmissions,
        home: homeEmissions,
        food: foodEmissions
      }
    };
  } catch (error) {
    logger.error('Error calculating emissions:', error);
    throw new Error('Failed to calculate emissions');
  }
};

// @desc    Calculate carbon footprint
// @route   POST /api/footprint/calculate
// @access  Private
exports.calculateFootprint = async (req, res) => {
  try {
    const { transportation, home, food } = req.body;
    
    // Calculate emissions
    const results = calculateEmissions({ transportation, home, food });
    
    // Create new footprint record
    const footprint = await Footprint.create({
      user: req.user._id,
      transportation,
      home,
      food,
      results
    });
    
    // Cache the latest result in Redis
    if (req.redisClient) {
      await req.redisClient.set(
        `user:${req.user._id}:latest-footprint`,
        JSON.stringify(footprint),
        { EX: 3600 } // Expire in 1 hour
      );
    }
    
    res.status(201).json({
      success: true,
      footprint
    });
  } catch (error) {
    logger.error('Calculate footprint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's footprint history
// @route   GET /api/footprint
// @access  Private
exports.getUserFootprints = async (req, res) => {
  try {
    let footprints;
    const limit = parseInt(req.query.limit) || 10;
    
    // Try to get from cache for better performance
    if (req.redisClient) {
      const cachedFootprints = await req.redisClient.get(`user:${req.user._id}:footprints`);
      
      if (cachedFootprints) {
        footprints = JSON.parse(cachedFootprints);
        return res.status(200).json({
          success: true,
          count: footprints.length,
          footprints,
          cached: true
        });
      }
    }
    
    // Get from database if not in cache
    footprints = await Footprint.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(limit);
    
    // Cache the results
    if (req.redisClient) {
      await req.redisClient.set(
        `user:${req.user._id}:footprints`,
        JSON.stringify(footprints),
        { EX: 300 } // Expire in 5 minutes
      );
    }
    
    res.status(200).json({
      success: true,
      count: footprints.length,
      footprints
    });
  } catch (error) {
    logger.error('Get user footprints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get footprint by ID
// @route   GET /api/footprint/:id
// @access  Private
exports.getFootprintById = async (req, res) => {
  try {
    const footprint = await Footprint.findById(req.params.id);
    
    // Check if footprint exists and belongs to user
    if (!footprint) {
      return res.status(404).json({
        success: false,
        message: 'Footprint not found'
      });
    }
    
    if (footprint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this footprint'
      });
    }
    
    res.status(200).json({
      success: true,
      footprint
    });
  } catch (error) {
    logger.error('Get footprint by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add reduction action to footprint
// @route   POST /api/footprint/:id/reductions
// @access  Private
exports.addReductionAction = async (req, res) => {
  try {
    const { category, action, potentialSavings } = req.body;
    
    const footprint = await Footprint.findById(req.params.id);
    
    // Check if footprint exists and belongs to user
    if (!footprint) {
      return res.status(404).json({
        success: false,
        message: 'Footprint not found'
      });
    }
    
    if (footprint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this footprint'
      });
    }
    
    footprint.reductions.push({
      category,
      action,
      potentialSavings,
      achieved: false
    });
    
    await footprint.save();
    
    // Invalidate cache
    if (req.redisClient) {
      await req.redisClient.del(`user:${req.user._id}:footprints`);
    }
    
    res.status(201).json({
      success: true,
      footprint
    });
  } catch (error) {
    logger.error('Add reduction action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update reduction status
// @route   PUT /api/footprint/:id/reductions/:reductionId
// @access  Private
exports.updateReductionStatus = async (req, res) => {
  try {
    const { achieved } = req.body;
    
    const footprint = await Footprint.findById(req.params.id);
    
    // Check if footprint exists and belongs to user
    if (!footprint) {
      return res.status(404).json({
        success: false,
        message: 'Footprint not found'
      });
    }
    
    if (footprint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this footprint'
      });
    }
    
    // Find the reduction
    const reduction = footprint.reductions.id(req.params.reductionId);
    
    if (!reduction) {
      return res.status(404).json({
        success: false,
        message: 'Reduction not found'
      });
    }
    
    // Update the status
    reduction.achieved = achieved;
    
    await footprint.save();
    
    // Invalidate cache
    if (req.redisClient) {
      await req.redisClient.del(`user:${req.user._id}:footprints`);
    }
    
    res.status(200).json({
      success: true,
      footprint
    });
  } catch (error) {
    logger.error('Update reduction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
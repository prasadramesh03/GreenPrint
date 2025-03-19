// backend/src/routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllRecommendations, 
  getPersonalizedRecommendations,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation
} = require('../controllers/recommendationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllRecommendations);
router.get('/personalized', protect, getPersonalizedRecommendations);

// Admin routes
router.post('/', protect, admin, createRecommendation);
router.put('/:id', protect, admin, updateRecommendation);
router.delete('/:id', protect, admin, deleteRecommendation);

module.exports = router;
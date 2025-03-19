// backend/src/routes/footprintRoutes.js
const express = require('express');
const router = express.Router();
const { 
  calculateFootprint, 
  getUserFootprints, 
  getFootprintById,
  addReductionAction,
  updateReductionStatus
} = require('../controllers/footprintController');
const { protect } = require('../middleware/authMiddleware');

router.post('/calculate', protect, calculateFootprint);
router.get('/', protect, getUserFootprints);
router.get('/:id', protect, getFootprintById);
router.post('/:id/reductions', protect, addReductionAction);
router.put('/:id/reductions/:reductionId', protect, updateReductionStatus);

module.exports = router;
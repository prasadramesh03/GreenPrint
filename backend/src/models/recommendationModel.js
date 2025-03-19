// backend/src/models/recommendationModel.js
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['transportation', 'home', 'food', 'general']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  potentialImpact: {
    type: Number, // Percentage reduction in carbon footprint
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  relevantFor: {
    dietTypes: [String],
    homeTypes: [String],
    transportationTypes: [String]
  },
  additionalResources: [{
    title: String,
    url: String
  }]
}, {
  timestamps: true
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
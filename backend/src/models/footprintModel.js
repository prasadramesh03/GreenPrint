// backend/src/models/footprintModel.js
const mongoose = require('mongoose');

const footprintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  transportation: {
    carType: {
      type: String,
      enum: ['gasoline', 'diesel', 'hybrid', 'electric', 'none'],
      default: 'none'
    },
    carMileage: {
      type: Number,
      default: 0
    },
    publicTransport: {
      type: Number,
      default: 0
    },
    flights: {
      type: Number,
      default: 0
    }
  },
  home: {
    electricityUsage: {
      type: Number,
      default: 0
    },
    gasUsage: {
      type: Number,
      default: 0
    },
    peopleInHousehold: {
      type: Number,
      default: 1
    }
  },
  food: {
    dietType: {
      type: String,
      enum: ['meat', 'mixed', 'vegetarian', 'vegan'],
      default: 'mixed'
    },
    foodWaste: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  },
  results: {
    totalEmissions: {
      type: Number,
      required: true
    },
    breakdown: {
      transportation: Number,
      home: Number,
      food: Number
    }
  },
  reductions: [{
    date: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['transportation', 'home', 'food']
    },
    action: String,
    potentialSavings: Number,
    achieved: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

const Footprint = mongoose.model('Footprint', footprintSchema);

module.exports = Footprint;
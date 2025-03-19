// backend/src/__tests__/footprint.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/user');
const Footprint = require('../models/footprint');

// Mock user for testing
const testUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Generate test JWT token
const token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greenprint_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  // Create test user
  await User.create(testUser);
});

afterAll(async () => {
  await User.deleteMany({});
  await Footprint.deleteMany({});
  await mongoose.connection.close();
});

describe('Footprint API Endpoints', () => {
  test('POST /api/footprints - Create new footprint calculation', async () => {
    const footprintData = {
      transport: 50,
      food: 30,
      housing: 40,
      goods: 20,
      services: 10
    };
    
    const response = await request(app)
      .post('/api/footprints')
      .set('Authorization', `Bearer ${token}`)
      .send(footprintData);
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('totalScore');
    expect(response.body.user.toString()).toBe(testUser._id.toString());
  });
  
  test('GET /api/footprints - Get user footprint history', async () => {
    // First create a footprint
    await Footprint.create({
      user: testUser._id,
      transport: 50,
      food: 30,
      housing: 40,
      goods: 20,
      services: 10,
      totalScore: 150
    });
    
    const response = await request(app)
      .get('/api/footprints')
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
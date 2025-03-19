// backend/src/__tests__/recommendation.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/user');
const Recommendation = require('../models/recommendation');
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
  
  // Create test user and footprint
  await User.create(testUser);
  await Footprint.create({
    user: testUser._id,
    transport: 50,
    food: 30,
    housing: 40,
    goods: 20,
    services: 10,
    totalScore: 150
  });
  
  // Create test recommendations
  await Recommendation.create([
    {
      title: 'Use public transport more',
      description: 'Reduce car usage by taking public transport when possible',
      category: 'Transport',
      potentialImpact: 4,
      difficulty: 'Medium',
      applicableScore: 100
    },
    {
      title: 'Eat less meat',
      description: 'Reduce meat consumption to once or twice a week',
      category: 'Food',
      potentialImpact: 5,
      difficulty: 'Medium',
      applicableScore: 80
    }
  ]);
});

afterAll(async () => {
  await User.deleteMany({});
  await Recommendation.deleteMany({});
  await Footprint.deleteMany({});
  await mongoose.connection.close();
});

describe('Recommendation API Endpoints', () => {
  test('GET /api/recommendations - Get personalized recommendations', async () => {
    const response = await request(app)
      .get('/api/recommendations')
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  test('POST /api/recommendations - Create new recommendation (admin only)', async () => {
    // Create admin user
    const adminUser = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true
    };
    
    await User.create(adminUser);
    const adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
    
    const newRecommendation = {
      title: 'Install solar panels',
      description: 'Generate renewable energy at home with solar panels',
      category: 'Housing',
      potentialImpact: 5,
      difficulty: 'Hard',
      applicableScore: 120
    };
    
    const response = await request(app)
      .post('/api/recommendations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newRecommendation);
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title', 'Install solar panels');
  });
});
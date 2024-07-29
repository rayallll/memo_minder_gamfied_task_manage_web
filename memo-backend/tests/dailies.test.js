const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user');
const Daily = require('../models/daily');
const History = require('../models/history');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe('Daily routes', () => {
  let token;
  let userId; // Define userId variable
  let dailyId;

  afterAll(async () => {
    // Delete all dailies associated with the user
    await Daily.deleteMany({ user: userId });
    await History.findOneAndDelete({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    await mongoose.connection.close();
  });

  beforeAll(async () => {
    const userData = {
      email: "18yp18@queensu.ca",
      password: "123123123",
      username: "testjude"
    };

    // Register a new user
    await api.post('/api/users').send(userData).expect(201);

    // Login the registered user and obtain the token
    const response = await api.post('/api/login').send(userData).expect(200);

    token = response.body.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    userId = decodedToken.id;
  });

  // Now you can use the obtained token to authenticate requests to your daily routes
  it('should add a new daily for the authenticated user', async () => {
    const newDailyData = {
      title: 'Morning Walk',
      startDate: '2024-03-08', // Add start date
      repeats: 'daily',
      repeatEvery: 1
    };

    // Making a POST request to add a new daily, authenticated with the obtained token
    const response = await api
      .post('/api/dailies')
      .set('Authorization', `${token}`)
      .send(newDailyData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Daily habit added successfully');
    expect(response.body.daily.title).toBe('Morning Walk');
    expect(response.body.daily.repeats).toBe('daily');

    // Extract the ID of the added daily for use in subsequent tests
    dailyId = response.body.daily._id;
  });

  
  it('should not add a new daily: incomplete body', async () => {
    const newDailyData = {
      startDate: '2024-03-08', // Add start date
      repeats: 'daily',
      repeatEvery: 1
    };
    
    const response = await api
      .post('/api/dailies')
      .set('Authorization', `${token}`)
      .send(newDailyData);

    expect(response.status).toBe(400);
  });

  it('should not add a new daily: wrong repeats', async () => {
    const newDailyData = {
      title: 'Morning Walk',
      startDate: '2024-03-08', // Add start date
      repeats: 'wrong',
      repeatEvery: 1
    };

    // Making a POST request to add a new daily, authenticated with the obtained token
    const response = await api
      .post('/api/dailies')
      .set('Authorization', `${token}`)
      .send(newDailyData);

    expect(response.status).toBe(400);
  });


  // Test GET /api/dailies/user/:userId
  it('should fetch all dailies for a specific user', async () => {
    const response = await api
      .get(`/api/dailies/user/${userId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.dailies).toBeDefined();
    expect(response.body.dailies.length).toBeGreaterThan(0);
  });

  // Test PUT /api/dailies/:dailyId
  it('should not modify an existing daily: no info', async () => {
    const dailyData = {
    };

    const response = await api
      .put(`/api/dailies/${dailyId}`)
      .set('Authorization', `${token}`)
      .send(dailyData);

    expect(response.status).toBe(400);
  });

    // Test PUT /api/dailies/:dailyId
    it('should not modify an existing daily: wrong id', async () => {
      const dailyData = {
        title: 'Evening Yoga',
        repeats: 'weekly', // Change repeats (optional)
        repeatEvery: 2 // Change repeatEvery (optional)
      };
  
      const response = await api
        .put(`/api/dailies/60c6d32167c8b7148cc7d145`)
        .set('Authorization', `${token}`)
        .send(dailyData);
  
      expect(response.status).toBe(404);
    });

  // Test PUT /api/dailies/:dailyId
  it('should modify an existing daily', async () => {
    const dailyData = {
      title: 'Evening Yoga',
      repeats: 'weekly', // Change repeats (optional)
      repeatEvery: 2 // Change repeatEvery (optional)
    };

    const response = await api
      .put(`/api/dailies/${dailyId}`)
      .set('Authorization', `${token}`)
      .send(dailyData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Daily habit modified successfully');
    expect(response.body.daily.title).toBe('Evening Yoga');
    expect(response.body.daily.repeats).toBe('weekly');
    expect(response.body.daily.repeatEvery).toBe(2);
  });

  // Test PUT /api/dailies/:dailyId/complete
  it('should mark a daily habit as completed', async () => {
    // Make a request to mark the daily habit as completed
    const response = await api
      .put(`/api/dailies/${dailyId}/complete`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Daily habit marked as completed');
    expect(response.body.daily.completed).toBe(true);
    // Add more assertions as needed
  });
  

  // Test DELETE /api/dailies/:dailyId
  it('should delete an existing daily', async () => {
    const response = await api
      .delete(`/api/dailies/${dailyId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Daily habit deleted successfully');
  });
});
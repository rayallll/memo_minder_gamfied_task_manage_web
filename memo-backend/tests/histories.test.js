const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const mongoose = require('mongoose');
const History = require('../models/history');
const Habit = require('../models/habit');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

describe('History routes', () => {
  let token;
  let userId;

  afterAll(async () => {
    await Habit.deleteMany({ user: userId });
    await History.findOneAndDelete({ user: userId });
    await User.findByIdAndDelete(userId);
    await mongoose.connection.close();
  });

  beforeAll(async () => {
    // Create a new user and obtain JWT token
    const userData = {
        email: "18yp18@queensu.ca",
        password: "123123123",
        username: "testjude"
    };
    const userResponse = await api
      .post('/api/users')
      .send(userData)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const loginResponse = await api
      .post('/api/login')
      .send(userData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    token = loginResponse.body.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    userId = decodedToken.id;
  });


  // Now you can use the obtained token to authenticate requests to your habits routes
  it('should add a new habit for the authenticated user', async () => {
    const newHabitData = {
      title: 'Exercise',
      note: "do exercise",
      type: 'positive'
    };
    // Making a POST request to add a new habit, authenticated with the obtained token
    const response = await api
      .post('/api/habits')
      .set('Authorization', `${token}`)
      .send(newHabitData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Habit added successfully');
    expect(response.body.habit.title).toBe('Exercise');
    expect(response.body.habit.type).toBe('positive');
  });

  it('should not fetch history: no such user', async () => {
    const response = await api
      .get(`/api/history/60c6d32167c8b7148cc7d145`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(404);
  });

  it('should fetch history for a specific user', async () => {
    const response = await api
      .get(`/api/history/${userId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.history).toBeDefined();
    // Add more assertions as needed
  });
});
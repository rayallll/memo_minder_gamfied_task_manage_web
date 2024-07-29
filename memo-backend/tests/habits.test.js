const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user');
const Habit = require('../models/habit');
const History = require('../models/history');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe('Habit routes', () => {
  let token;
  let userId; // Define userId variable
  let habitId;


  afterAll(async () => {
    // Delete all dailies associated with the user
    await Habit.deleteMany({ user: userId });
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
    const response_re = await api
    .post('/api/users')
    .send(userData)
    .expect(201)
    .expect('Content-Type', /application\/json/);

    // Making a POST request to the login route to obtain a JWT token
    const response = await api
      .post('/api/login')
      .send(userData)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    // Extracting the token from the response body
    token = response.body.token;
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

    // Extract the ID of the added habit for use in subsequent tests
    habitId = response.body.habit._id;
  });

  
  it('should not add a new habit due to incomplete body', async () => {
    const newHabitData = {
      type: 'positive'
    };
    // Making a POST request to add a new habit, authenticated with the obtained token
    const response = await api
      .post('/api/habits')
      .set('Authorization', `${token}`)
      .send(newHabitData);

    expect(response.status).toBe(400);
  });

  it('should not add a new habit due to wrong type', async () => {
    const newHabitData = {
      title: 'Exercise',
      note: "do exercise",
      type: 'wrong'
    };
    // Making a POST request to add a new habit, authenticated with the obtained token
    const response = await api
      .post('/api/habits')
      .set('Authorization', `${token}`)
      .send(newHabitData);

    expect(response.status).toBe(400);
  });

  // Test GET /api/habits/user/:userId
  it('should fetch all habits for a specific user', async () => {

    const response = await api
      .get(`/api/habits/user/${userId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.habits).toBeDefined();
    expect(response.body.habits.length).toBeGreaterThan(0);
  });

  // Test PUT /api/habits/:habitId/increment/positive
  it('should increment the positive counter for the habit', async () => {
    // Make a request to increment the positive counter for the habit
    const response = await api
      .put(`/api/habits/${habitId}/increment/positive`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Positive counter incremented successfully');
    // Add more assertions as needed
  });

  // Test PUT /api/habits/:habitId
  it('should not modify a habit: no title and note provided', async () => {
    const habitData = {
      type: 'negative' // New type (optional)
    };

    const response = await api
      .put(`/api/habits/${habitId}`)
      .set('Authorization', `${token}`)
      .send(habitData);

    expect(response.status).toBe(400);
  });

  // Test PUT /api/habits/:habitId
  it('should not modify a habit: habit not exist', async () => {
    const habitData = {
      title: 'New Habit Title',
      note: 'Updated notes about the habit',
      type: 'negative' // New type (optional)
    };

    const response = await api
      .put(`/api/habits/60c6d32167c8b7148cc7d145`)
      .set('Authorization', `${token}`)
      .send(habitData);

    expect(response.status).toBe(404);
  });

  // Test PUT /api/habits/:habitId
  it('should modify an existing habit', async () => {
    const habitData = {
      title: 'New Habit Title',
      note: 'Updated notes about the habit',
      type: 'negative' // New type (optional)
    };

    const response = await api
      .put(`/api/habits/${habitId}`)
      .set('Authorization', `${token}`)
      .send(habitData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Habit modified successfully');
    expect(response.body.habit.title).toBe('New Habit Title');
    expect(response.body.habit.note).toBe('Updated notes about the habit');
  });

  // Test PUT /api/habits/:habitId/increment/negative
  it('should increment the negative counter for the habit', async () => {
    // Make a request to increment the negative counter for the habit
    const response = await api
      .put(`/api/habits/${habitId}/increment/negative`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Negative counter incremented successfully');
    // Add more assertions as needed
  });

  // Test DELETE /api/habits/:habitId
  it('should delete an existing habit', async () => {
    const response = await api
      .delete(`/api/habits/${habitId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Habit deleted successfully');
  });

  // Test DELETE /api/habits/:habitId
  it('should not delete an existing habit: not found', async () => {
    const response = await api
      .delete(`/api/habits/${habitId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(404);
  });
});
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Reward = require('../models/reward');
const User = require('../models/user');
const History = require('../models/history');

describe('Reward routes', () => {
  let token;
  let userId;
  let rewardId;

  afterAll(async () => {
    // Delete all rewards associated with the user
    await Reward.deleteMany({ user: userId });
    await History.findOneAndDelete({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Close the mongoose connection
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

  it('should add a new reward for the authenticated user', async () => {
    const newRewardData = {
      title: 'Free Movie Ticket',
      note: 'Redeemable at any theater',
      cost: 50
    };

    const response = await api
      .post('/api/rewards')
      .set('Authorization', `${token}`)
      .send(newRewardData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Reward added successfully');
    expect(response.body.reward.title).toBe('Free Movie Ticket');

    rewardId = response.body.reward._id;
  });

  it('should fetch all rewards for a specific user', async () => {
    const response = await api
      .get(`/api/rewards/user/${userId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.rewards.length).toBeGreaterThan(0);
  });

  it('should modify an existing reward', async () => {
    const updatedRewardData = {
      title: 'Free Dinner Voucher',
      note: 'Valid at selected restaurants',
      cost: 75
    };

    const response = await api
      .put(`/api/rewards/${rewardId}`)
      .set('Authorization', `${token}`)
      .send(updatedRewardData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reward modified successfully');
    expect(response.body.reward.title).toBe('Free Dinner Voucher');
  });

  it('should mark a reward as completed', async () => {
    const response = await api
      .put(`/api/rewards/${rewardId}/complete`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reward marked as completed');
    expect(response.body.reward.completed).toBe(true);
  });

  it('should delete an existing reward', async () => {
    const response = await api
      .delete(`/api/rewards/${rewardId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reward deleted successfully');
  });
});
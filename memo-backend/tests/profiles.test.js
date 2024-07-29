const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Profile = require('../models/profile');
const User = require('../models/user');

describe('Profile routes', () => {
  let token;
  let userId;
  let profileId;

  afterAll(async () => {
    // Delete all profiles associated with the user
    await Profile.deleteMany({ profileId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Close the mongoose connection
    await mongoose.connection.close();
  });

  beforeAll(async () => {
    // Create a new user and obtain JWT token
    const userData = {
      email: "example@example.com",
      password: "password123",
      username: "testuser"
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

  it('should fetch the profile for a specific user', async () => {
    const response = await api
      .get(`/api/profiles/${userId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.health).toBe(100);
    expect(response.body.level).toBe(1);
    expect(response.body.experience).toBe(0);
    expect(response.body.coins).toBe(0);
  });

  it('should modify an existing profile', async () => {
    const updatedProfileData = {
      health: 90,
      level: 2,
      coins: 10
    };

    const response = await api
      .put(`/api/profiles/${userId}`)
      .set('Authorization', `${token}`)
      .send(updatedProfileData);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.health).toBe(90);
    expect(response.body.level).toBe(2);
    expect(response.body.experience).toBe(0);
    expect(response.body.coins).toBe(10);
  });

  it('should delete an existing profile', async () => {
    const response = await api
      .delete(`/api/profiles/${userId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(204);

    // Ensure profile is deleted from database
    const deletedProfile = await Profile.findOne({ userId });
    expect(deletedProfile).toBeNull();
  });
});

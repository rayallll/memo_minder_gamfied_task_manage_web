const supertest = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');

const api = supertest(app);

describe('User endpoints', () => {
  let userId;
  
  afterAll(async () => {
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

  test('Login with correct credentials should return a token', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testjude', password: '123123123'})
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.token).toBeDefined();
  });

  test('Login with incorrect credentials should return 401', async () => {
    await api
      .post('/api/login')
      .send({ username: 'newuser', password: 'wrongpassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });
});


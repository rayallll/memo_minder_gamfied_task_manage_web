const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Todo = require('../models/todo');
const User = require('../models/user');
const History = require('../models/history');

describe('Todo routes', () => {
  let token;
  let userId;
  let todoId;

  afterAll(async () => {
    // Delete all todos associated with the user
    await Todo.deleteMany({ user: userId });
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

  it('should add a new todo for the authenticated user', async () => {
    const newTodoData = {
      title: 'Complete assignment',
      note: 'Finish the project by Friday',
      dueDate: '2024-03-08'
    };

    const response = await api
      .post('/api/todos')
      .set('Authorization', `${token}`)
      .send(newTodoData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Todo added successfully');
    expect(response.body.todo.title).toBe('Complete assignment');

    todoId = response.body.todo._id;
  });

  it('should fetch all todos for a specific user', async () => {
    const response = await api
      .get(`/api/todos/user/${userId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.todos.length).toBeGreaterThan(0);
  });

  it('should modify an existing todo', async () => {
    const updatedTodoData = {
      title: 'Updated assignment',
      note: 'Revised project requirements',
      dueDate: '2024-03-09'
    };

    const response = await api
      .put(`/api/todos/${todoId}`)
      .set('Authorization', `${token}`)
      .send(updatedTodoData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Todo modified successfully');
    expect(response.body.todo.title).toBe('Updated assignment');
  });

  it('should mark a todo as completed', async () => {
    const response = await api
      .put(`/api/todos/${todoId}/complete`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Todo marked as completed');
    expect(response.body.todo.completed).toBe(true);
  });

  it('should delete an existing todo', async () => {
    const response = await api
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Todo deleted successfully');
  });
});
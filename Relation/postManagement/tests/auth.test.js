// tests/auth.test.js
const request = require('supertest');
const app = require('../index');
const User = require('../models/user');

describe('Authentication Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User Registration', () => {
    test('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          username: 'testuser',
          password: 'Password123!'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    test('should not register user with existing email', async () => {
      await User.create({
        username: 'existing',
        password: 'Password123!'
      });

      const res = await request(app)
        .post('/user/register')
        .send({
          username: 'testuser',
          password: 'Password123!'
        });

      expect(res.status).toBe(400);
    });
  });
});
const request = require('supertest');
const express = require('express');
const postRoutes = require('../routes/postRoutes'); // Import your routes

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use('/post/new', postRoutes); // Use your route

describe('POST /post/new', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/post/new')
      .send({
        title: 'Sample Post',
        content: 'This is a sample post.'
      });

    expect(res.statusCode).toEqual(201); // Check if the status code is 201
    expect(res.body).toHaveProperty('title', 'Sample Post'); // Check if the response contains the post data
  });
});

// tests/post.test.js
const request = require('supertest');
const app = require('../index');
const Post = require('../models/post');
const { setupTestUser } = require('./test.utils');

describe('Post Management Tests', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    const testSetup = await setupTestUser();
    testUser = testSetup.user;
    authToken = testSetup.token;
  });

  describe('Post Creation', () => {
    test('should create a new post successfully', async () => {
      const res = await request(app)
        .post('/post/new')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'This is a test post content',
          user_id: 
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Post');
      expect(res.body).toHaveProperty('author', testUser._id.toString());
    });

    test('should not create post without authentication', async () => {
      const res = await request(app)
        .post('/post/new')
        .send({
          title: 'Test Post',
          content: 'This is a test post content'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('Post Retrieval', () => {
    let testPost;

    beforeEach(async () => {
      testPost = await Post.create({
        title: 'Test Post',
        content: 'Test content',
        author: testUser._id
      });
    });

    test('should get all posts', async () => {
      const res = await request(app)
        .get('/post/')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
    });

    test('should get single post by id', async () => {
      const res = await request(app)
        .get(`/post/${testPost._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'Test Post');
    });
  });
});
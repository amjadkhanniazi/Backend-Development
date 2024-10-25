// tests/test.utils.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const setupTestUser = async () => {
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!'
  });
  
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'test-secret'
  );
  
  return { user, token };
};

module.exports = { setupTestUser };
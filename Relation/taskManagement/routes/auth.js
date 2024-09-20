import express from 'express';
import user from '../models/user.js';
import 'dotenv/config';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const newUser = new user({ username, password, email });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      // Look for the user by either username or email
      const newUser = await user.findOne({ 
        $or: [{ username: username }, { email: username }] 
      });
      if (!newUser) return res.status(400).json({ error: 'Invalid credentials' });
  
      // Compare the provided password with the stored hashed password
      const isMatch = await newUser.comparePassword(password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      // Generate token upon successful login
      const token = newUser.getToken();
      res.json({ token, userId: newUser._id });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;
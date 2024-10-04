import express from 'express';
import user from '../models/user.js';
import validateUser from '../middlewares/validateUser.js';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {

  const { error } = validateUser(req.body);  // Validate user input
  if (error) return res.status(400).send({Message: error.details[0].message});


  const { username, password, role } = req.body;
  try {
    const newUser = new user({ username, password, role });
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

    const newUser = await user.findOne({ username });
    if (!newUser) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await newUser.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = newUser.getToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
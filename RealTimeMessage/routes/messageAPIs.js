// routes/messageApi.js
import express from 'express';
import Message from '../models/messages.js';
import authenticateToken from '../middlewares/authentication.js';
import 'dotenv/config';

const router = express.Router();

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).populate('user', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a new message
router.post('/', authenticateToken, async (req, res) => {
  const { text } = req.body;
  try {
    const newMessage = new Message({ text, user: req.user._id });
    await newMessage.save();
    const populatedMessage = await Message.findById(newMessage._id).populate('user', 'username');
    req.app.get('io').emit('message', populatedMessage);
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    if (message.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this message' });
    }
    await message.deleteOne();
    req.app.get('io').emit('messageDeleted', req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
import express from 'express';
import fruits from '../models/fruits.js';
import authenticateToken from '../middlewares/auth.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// Public route
router.get('/', async (req, res) => {
  const fruit = await fruits.find();
  res.json(fruit);
});

// Protected routes with different authorization levels
router.post('/new', authenticateToken, authorize(['editor', 'admin']), async (req, res) => {
  const { name, priceKG, quantityKG } = req.body;
  const userId = req.user.id;
  const newFruit = new fruits({
    name,
    priceKG,
    quantityKG,
    user: userId
  });
  await newFruit.save();
  res.json({
    message: 'fruit added successfully'
  });
});

router.get('/:id', authenticateToken, authorize(['user', 'editor', 'admin']), async (req, res) => {
  const fruit = await fruits.findById(req.params.id);
  res.json(fruit);
});

router.put('/:id', authenticateToken, authorize(['editor', 'admin']), async (req, res) => {
  const { name, priceKG, quantityKG } = req.body;
  await fruits.findByIdAndUpdate(req.params.id, { name, priceKG, quantityKG });
  res.json({
    message: 'fruit updated successfully'
  });
});

router.delete('/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  await fruits.findByIdAndDelete(req.params.id);
  res.json({
    message: 'fruit deleted successfully'
  });
});

// Route to get all fruits by a specific user
router.get('/user/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userFruit = await fruits.find({ user: id });

    res.status(200).json(userFruit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
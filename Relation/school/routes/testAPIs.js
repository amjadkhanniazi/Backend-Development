import express from 'express';
import tests from '../models/tests.js';
import authenticateToken from '../middlewares/authentication.js';
import authorize from '../middlewares/authorization.js';

const router = express.Router();

// Get all tests
router.get('/', authenticateToken, authorize(['teacher']), async (req, res) => {
  try {
    const alltests = await tests.find();
    res.json(alltests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a Test
router.post('/newTest', authenticateToken, authorize(['teacher']), async (req, res) => {
  const id=req.user._id;
  
  const { testname, testdate, testtime, testduration, totalmarks, remarks } = req.body;
  try {
    const newTest = new tests({ testname, testdate, testtime, testduration, totalmarks, remarks, user: id });
    await newTest.save();
    res.status(201).json({ message: 'Test created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a Test
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const test = await tests.findById(req.params.id);
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Test
router.put('/update/:id', authenticateToken, async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  try {
    await tests.findByIdAndUpdate (req.params.id, req.body);
    res.json({ message: 'Test updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

//updating using patch
router.patch('/updatepatch/:id', authenticateToken, async (req, res) => {
  try {
    await tests.findByIdAndUpdate (req.params.id, req.body);
    res.json({ message: 'Test updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Delete a Test
router.delete('/delete/:id', authenticateToken, authorize(['teacher']), async (req, res) => {
  try {
    await tests.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
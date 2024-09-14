import express from  'express';
import task from '../models/task.js';
import authenticateToken from '../middleware/authentication.js';

const router = express.Router();


// Route to create a task
router.post('/', authenticateToken, async (req, res) => {
    try {
      const newTask = new task(req.body);
      newTask.user_id=req.user.id;
      // newTask.dueDate=Date.now();
      await newTask.save();
      res.status(201).json({
        message: "Task created successfully"
      });
    } catch (err) {
      res.status(400).json(err);

    }
  });


// Route to mark a task as completed
router.patch('/iscompletedtask/:taskId',authenticateToken, async (req, res) => {
    try {
      const Updatedtask = await task.findByIdAndUpdate(req.params.taskId, { completed: true }, { new: true });
      
      res.json(Updatedtask);
    } catch (err) {
      res.status(400).json(err);
    }
  });


  // Route to get all tasks for a user
router.get('/users/:userId',authenticateToken, async (req, res) => {
    try {
      const tasks = await task.find({ user_id: req.params.userId });
      res.json(tasks);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.delete('/delete/:taskId', authenticateToken, async (req, res) => {
        await  task.findByIdAndDelete(req.params.taskId);
        res.json({ message: "Task deleted successfully" });
  })
  
export default router;
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Todo = require('../models/todo');
const History = require('../models/history');
const updateProfileAfterTaskCompletion = require('../utils/profileHelpers')


// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Route to add a new todo
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, note, dueDate } = req.body;
    const userId = req.user.id;

    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }

    const todo = new Todo({
      title,
      note,
      dueDate,
      user: userId
    });

    await todo.save();

    await History.findOneAndUpdate(
      { user: userId }, // Find the user's history
      { $inc: { todosAdded: 1 } }, // Increment the todosAdded field by 1
      { upsert: true } // Create a new history entry if it doesn't exist
    );

    res.status(201).json({ message: 'Todo added successfully', todo });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch all todos for a specific user
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
    const todos = await Todo.find({ user: userId });
    res.status(200).json({ todos });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to modify a todo (update title, note, and due date)
router.put('/:todoId', verifyToken, async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const userId = req.user.id;
    const { title, note, dueDate } = req.body;

    if (!title && !note && !dueDate) {
      return res.status(400).json({ message: 'Title, note, or due date is required for modification' });
    }

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (title) {
      todo.title = title;
    }
    if (note) {
      todo.note = note;
    }
    if (dueDate) {
      todo.dueDate = dueDate;
    }

    await todo.save();

    res.status(200).json({ message: 'Todo modified successfully', todo });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a todo
router.delete('/:todoId', verifyToken, async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const userId = req.user.id;

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await Todo.findByIdAndDelete(todoId);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to mark a todo as completed
router.put('/:todoId/complete', verifyToken, async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const userId = req.user.id;

    // Find the todo by ID and user
    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if the todo is already completed
    if (todo.completed) {
      return res.status(400).json({ message: 'Todo is already completed' });
    }

    // Update the todo status to completed
    todo.completed = true;

    // Save the updated todo
    await todo.save();

    // Update the user's history
    await History.findOneAndUpdate(
      { user: userId },
      { $inc: { todosCompleted: 1 } }, // Increment the todosCompleted field by 1
      { upsert: true }
    );

    // update profile
    const updatedProfile = await updateProfileAfterTaskCompletion(userId, 'todo');

    res.status(200).json({ message: 'Todo marked as completed', todo, updatedProfile });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
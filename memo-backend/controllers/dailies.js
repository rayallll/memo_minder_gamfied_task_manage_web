const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Daily = require('../models/daily');
const History = require('../models/history');
const updateProfileAfterTaskCompletion = require('../utils/profileHelpers')

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET); // Use process.env.SECRET
    req.user = decoded; // Attach user information to request object
    next(); // Move to the next middleware
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Route to add one daily for a specific user
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, note, startDate, repeats, repeatEvery } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!userId || !title || !startDate || !repeats || !repeatEvery) {
      return res.status(400).json({ message: 'userId, title, startDate, repeats, and repeatEvery are required' });
    }

    // Check if the repeats value is valid
    const validRepeats = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validRepeats.includes(repeats)) {
      return res.status(400).json({ message: 'Invalid repeats value' });
    }

    // Create the daily habit object
    const daily = new Daily({
      title,
      note,
      startDate,
      repeats,
      repeatEvery,
      user: userId
    });

    // Save the daily habit object to the database
    await daily.save();

    // Update the user's history
    await History.findOneAndUpdate(
      { user: userId },
      { $inc: { dailiesAdded: 1 } }, // Increment the dailiesAdded field by 1
      { upsert: true }
    );

    res.status(201).json({ message: 'Daily habit added successfully', daily });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch all dailies for a specific user
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
    // Find all dailies for the specified user
    const dailies = await Daily.find({ user: userId });
    res.status(200).json({ dailies });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to modify a daily habit (update title, note, repeats, and repeatEvery)
router.put('/:dailyId', verifyToken, async (req, res) => {
  try {
    const dailyId = req.params.dailyId;
    const userId = req.user.id;
    const { title, note, repeats, repeatEvery } = req.body;

    // Check if title, note, repeats, or repeatEvery is provided
    if (!title && !note && !repeats && !repeatEvery) {
      return res.status(400).json({ message: 'Title, note, repeats, or repeatEvery is required for modification' });
    }

    // Find the daily habit and ensure it belongs to the authenticated user
    const daily = await Daily.findOne({ _id: dailyId, user: userId });
    if (!daily) {
      return res.status(404).json({ message: 'Daily habit not found' });
    }

    // Update the daily habit with new title, note, repeats, or repeatEvery if provided
    if (title) {
      daily.title = title;
    }
    if (note) {
      daily.note = note;
    }
    if (repeats) {
      daily.repeats = repeats;
    }
    if (repeatEvery) {
      daily.repeatEvery = repeatEvery;
    }

    // Save the updated daily habit
    await daily.save();

    res.status(200).json({ message: 'Daily habit modified successfully', daily });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a daily habit
router.delete('/:dailyId', verifyToken, async (req, res) => {
  try {
    const dailyId = req.params.dailyId;
    const userId = req.user.id;

    // Ensure that the requested daily habit belongs to the authenticated user
    const daily = await Daily.findOne({ _id: dailyId, user: userId });
    if (!daily) {
      return res.status(404).json({ message: 'Daily habit not found' });
    }

    // Delete the daily habit
    await Daily.findByIdAndDelete(dailyId);
    res.status(200).json({ message: 'Daily habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to mark a daily habit as completed
router.put('/:dailyId/complete', verifyToken, async (req, res) => {
  try {
    const dailyId = req.params.dailyId;
    const userId = req.user.id;

    // Find the daily habit and ensure it belongs to the authenticated user
    const daily = await Daily.findOne({ _id: dailyId, user: userId });
    if (!daily) {
      return res.status(404).json({ message: 'Daily habit not found' });
    }

    // Check if the daily habit is already completed
    if (daily.completed) {
      return res.status(400).json({ message: 'Daily habit is already completed' });
    }

    // Update the completion status to true
    daily.completed = true;

    // Save the updated daily habit
    await daily.save();

    // Update the user's history
    await History.findOneAndUpdate(
      { user: userId },
      { $inc: { dailiesCompleted: 1 } }, // Increment the dailiesCompleted field by 1
      { upsert: true }
    );

    // update profile
    const updatedProfile = await updateProfileAfterTaskCompletion(userId, 'daily');

    res.status(200).json({ message: 'Daily habit marked as completed', daily, updatedProfile });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
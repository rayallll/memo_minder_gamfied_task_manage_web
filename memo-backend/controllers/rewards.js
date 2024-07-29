const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Reward = require('../models/reward');
const History = require('../models/history');

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

// Route to fetch all rewards for a specific user
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
    const rewards = await Reward.find({ user: userId });
    res.status(200).json({ rewards });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to add a new reward for a specific user
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, note, cost } = req.body;
    const userId = req.user.id;

    if (!userId || !title || !cost) {
      return res.status(400).json({ message: 'userId, title, and cost are required' });
    }

    const reward = new Reward({
      title,
      note,
      cost,
      user: userId
    });

    await reward.save();

    // Update the user's history
    await History.findOneAndUpdate(
      { user: userId },
      { $inc: { rewardsAdded: 1 } }, // Increment the rewardsAdded field by 1
      { upsert: true }
    );

    res.status(201).json({ message: 'Reward added successfully', reward });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to modify a reward (update title, note, or cost)
router.put('/:rewardId', verifyToken, async (req, res) => {
  try {
    const rewardId = req.params.rewardId;
    const userId = req.user.id;
    const { title, note, cost } = req.body;

    if (!title && !note && !cost) {
      return res.status(400).json({ message: 'Title, note, or cost is required for modification' });
    }

    const reward = await Reward.findOne({ _id: rewardId, user: userId });
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    if (title) {
      reward.title = title;
    }
    if (note) {
      reward.note = note;
    }
    if (cost) {
      reward.cost = cost;
    }

    await reward.save();

    res.status(200).json({ message: 'Reward modified successfully', reward });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a reward
router.delete('/:rewardId', verifyToken, async (req, res) => {
  try {
    const rewardId = req.params.rewardId;
    const userId = req.user.id;

    const reward = await Reward.findOne({ _id: rewardId, user: userId });
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    await Reward.findByIdAndDelete(rewardId);
    res.status(200).json({ message: 'Reward deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to mark a reward as completed
router.put('/:rewardId/complete', verifyToken, async (req, res) => {
  try {
    const rewardId = req.params.rewardId;
    const userId = req.user.id;

    // Find the reward by ID and user
    const reward = await Reward.findOne({ _id: rewardId, user: userId });
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    // Update the reward status to completed
    reward.completed = true;
    
    // Save the updated reward
    await reward.save();
    
    // Update the user's history
    await History.findOneAndUpdate(
      { user: userId },
      { $inc: { rewardsCompleted: 1 } }, // Increment the rewardsCompleted field by 1
      { upsert: true }
    );

    res.status(200).json({ message: 'Reward marked as completed', reward });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

const profilesRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Profile = require('../models/profile')


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


profilesRouter.get('/:userId', verifyToken, async (request, response) => {
  const { userId } = request.params;
  const profile = await Profile.findOne({ userId });

  if (profile) {
    response.json(profile);
  } else {
    response.status(404).json({ error: 'Profile not found' });
  }
});


profilesRouter.post('/', verifyToken, async (request, response) => {
  const { userId, health, level, experience, coins } = request.body;
  const existingProfile = await Profile.findOne({ userId });

  if (existingProfile) {
    return response.status(400).json({ error: 'Profile already exists for this user' });
  }

  const profile = new Profile({ userId, health, level, experience, coins });
  const savedProfile = await profile.save();
  response.status(201).json(savedProfile);
});


profilesRouter.put('/:userId', verifyToken, async (request, response) => {
  const { userId } = request.params;
  const { health, level, experience, coins } = request.body;

  const updatedProfile = await Profile.findOneAndUpdate({ userId }, { health, level, experience, coins }, { new: true });

  if (updatedProfile) {
    response.json(updatedProfile);
  } else {
    response.status(404).json({ error: 'Profile not found' });
  }
});


profilesRouter.delete('/:userId', verifyToken, async (request, response) => {
  const { userId } = request.params;

  const deletedProfile = await Profile.findOneAndDelete({ userId });

  if (deletedProfile) {
    response.status(204).json({ message: 'Profile deleted successfully' });
  } else {
    response.status(404).json({ error: 'Profile not found' });
  }
});

module.exports = profilesRouter
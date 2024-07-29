const Profile = require('../models/profile')

// update profile based on the completed task
async function updateProfileAfterTaskCompletion(userId, taskType) {
  // Fetch the user's profile
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new Error('Profile not found');
  }

  // Define the task rewards
  const taskRewards = {
    'goodHabit': { experience: 20, coins: 10, health: 0 },
    'badHabit': { experience: 0, coins: 0, health: -10 },
    'todo': { experience: 20, coins: 10, health: 0 },
    'daily': { experience: 20, coins: 10, health: 0 },
  };

  const reward = taskRewards[taskType];
  if (!reward) {
    throw new Error('Invalid task type');
  }

  // Update the profile with rewards
  profile.health = Math.max(0, profile.health + reward.health);
  profile.coins += reward.coins;
  profile.experience += reward.experience;

  // Check for level up
  if (profile.experience >= 100) {
    profile.level += 1;
    profile.experience -= 100;
    profile.health = 100;
  }

  // Save changes to the database
  await profile.save();

  return profile;
}

module.exports = updateProfileAfterTaskCompletion;

const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  note: {
    type: String,
    maxlength: 500
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false // Defaults to false when a reward is created
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;  
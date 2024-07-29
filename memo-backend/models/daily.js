const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: true
  },
  repeats: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  repeatEvery: {
    type: Number,
    required: true,
    min: 1
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Daily = mongoose.model('Daily', dailySchema);

module.exports = Daily;
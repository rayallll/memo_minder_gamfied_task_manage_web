const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1, // Minimum length of 1 characters
    maxlength: 100 // Maximum length of 100 characters
  },
  note: {
    type: String,
    maxlength: 500 // Maximum length of 500 characters
  },
  type: {
    type: String,
    enum: ['positive', 'negative', 'both', 'neutral'],
    default: 'both'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Add conditional fields based on habit type
habitSchema.add({
  positiveCount: {
    type: Number,
    default: 0,
    required: function() {
      return this.type === 'positive' || this.type === 'both';
    }
  },
  negativeCount: {
    type: Number,
    default: 0,
    required: function() {
      return this.type === 'negative' || this.type === 'both';
    }
  }
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
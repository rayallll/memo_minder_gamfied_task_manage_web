const mongoose = require('mongoose');

const bagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shopItem'
  }]
});

const Bag = mongoose.model('Bag', bagSchema);

module.exports = Bag;
const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  soldOut: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: true
  },
  unlockLevel: {
    type: Number, default: 0
  },
  attack: {
    type: Number,
    required: true
  }
});

const ShopItem = mongoose.model('ShopItem', shopItemSchema);

module.exports = ShopItem;
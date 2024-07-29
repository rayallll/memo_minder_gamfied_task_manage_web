const shopRouter = require('express').Router()
const ShopItem = require('../models/shopItem')
const jwt = require('jsonwebtoken')
const Bag = require('../models/bag')
const User = require('../models/user');
const Profile = require('../models/profile');



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


shopRouter.get('/', verifyToken, async (request, response) => {
  const userId = request.user.id;
  const user = await User.findById(userId);
  const userBag = await Bag.findOne({ userId });
  const userItems = userBag ? userBag.items : [];

  const items = await Item.find({ unlockLevel: { $lte: user.level } })
    .lean()
    .exec();

  const showItems = items.map(item => {
    item.soldOut = userItems.includes(item._id);
    return item;
  });

  response.json(showItems);
});


shopRouter.post('/buy/:itemId', verifyToken, async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  const profile = await Profile.findOne({ userId });
  if (!profile) return res.status(404).json({ message: 'Profile not found' });

  const item = await ShopItem.findById(itemId);
  if (!item) {
    return response.status(404).json({ error: 'Item not found' });
  }

  if (profile.level < item.unlockLevel)
    return res.status(403).json({ message: 'Level too low to purchase this item' });

  const userBag = await Bag.findOne({ userId });
  if (userBag && userBag.items.includes(itemId))
    return res.status(400).json({ message: 'Item already owned' });

  if (profile.coins < item.price)
    return res.status(400).json({ message: 'Not enough coins' });

  profile.coins -= item.price;
  await profile.save();

  if (!userBag) {
    await new Bag({ userId, items: [itemId] }).save();
  } else {
    userBag.items.push(itemId);
    await userBag.save();
  }

  res.json({ message: 'Item purchased successfully', item });
});


// init shop item - hard coding
shopRouter.post('/shopitems', async (request, response) => {
  const { name, image, soldOut, price, unlockLevel, attack } = request.body;

  const newItem = new ShopItem({
    name,
    image,
    soldOut,
    price,
    unlockLevel,
    attack
  });

  newItem.save()
    .then(savedItem => {
      response.status(201).json(savedItem);
    })
    .catch(error => response.status(400).json({ error: 'Failed to add new item' }));
});





module.exports = shopRouter
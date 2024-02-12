const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../models/product');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 8);

    const user = new User({ username, email, passwordHash });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token: token,
      isAdmin: user.isAdmin 
  });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFavorite = async (req, res) => {
    const userId = req.user._id; 
    const { productId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user.favorites.includes(productId)) {
        user.favorites.push(productId);
        await user.save();
        res.status(200).json({ message: 'Product added to favorites' });
      } else {
        res.status(400).json({ message: 'Product already in favorites' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.removeFavorite = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params; 
  
    try {
      await User.findByIdAndUpdate(userId, { $pull: { favorites: productId } });
      res.status(200).json({ message: 'Product removed from favorites' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getFavorites = async (req, res) => {
    const userId = req.user._id;
  
    try {
      const user = await User.findById(userId).populate('favorites');
      res.status(200).json(user.favorites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getAllUsersWithFavorites = async (req, res) => {
    if (!req.user.isAdmin) { 
      return res.status(403).json({ message: 'Access denied' });
    }
  
    try {
      const users = await User.find().populate('favorites').select('-password'); // Excluding password for security
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

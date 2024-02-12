const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};
const isAdmin = async (req, res, next) => {

  if (!req.user) {
      return res.status(403).json({ message: 'No authentication data found' });
  }

  try {
      const user = await User.findById(req.user.id);
      if (user && user.isAdmin) {
          next(); 
      } else {
          res.status(403).json({ message: 'Access denied' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Server error checking admin status' });
  }
};
module.exports = { authenticate,isAdmin};

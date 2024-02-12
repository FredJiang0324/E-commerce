const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { addFavorite, removeFavorite, getFavorites,getAllUsersWithFavorites  } = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/authenticate');
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/favorites/add', authenticate, addFavorite);
router.delete('/favorites/remove/:productId', authenticate, removeFavorite);
router.get('/favorites', authenticate, getFavorites);
router.get('/admin', authenticate, isAdmin, getAllUsersWithFavorites);

module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.get('/', productController.getAllProducts);

router.get('/details/:productId', productController.getProductById);

router.get('/brands', productController.getBrands);
router.get('/types', productController.getTypes);
router.get('/related/:productId', productController.getRelatedProducts);

module.exports = router;

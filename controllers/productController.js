const Product = require('../models/product');

// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.getAllProducts = async (req, res) => {
  const { page = 1, brand, type } = req.query;
  const query = {};
  
  if (brand) query.brand = { $in: brand.split(';') };
  if (type) query.type = { $in: type.split(';') };
  
  try {
    const products = await Product.find(query)
                                  .skip((page - 1) * 9)
                                  .limit(9);
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / 9);
    res.json({ products, totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.find().distinct('brand');
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTypes = async (req, res) => {
  try {
    const types = await Product.find().distinct('type');
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const relatedProducts = await Product.find({ 
          _id: { $ne: product._id }, 
          brand: product.brand 
      }).limit(5); 

      res.json(relatedProducts);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};
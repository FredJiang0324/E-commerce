require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('./models/brand');
const Product = require('./models/product');
const User = require('./models/user');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));
  const brands = [
    { name: 'BrandA' },
    { name: 'BrandB' },
    { name: 'BrandC' }
  ];
  
  const products = [];

  for (let i = 1; i <= 30; i++) {
      products.push({
          name: `Product${i}`,
          brand: `Brand${i % 5 + 1}`, 
          type: `Type${i % 3 + 1}`,
          description: `Description of product ${i}`,
          price: (i % 10 + 1) * 100, 
          imageUrl: `https://picsum.photos/200/300?random=${i}`
      });
  }
  
  async function seedDB() {
    await mongoose.connection.dropDatabase();
  
    const insertedBrands = await Brand.insertMany(brands);
    console.log('Brands Seeded:', insertedBrands);
  
    products.forEach(product => {
      const brand = insertedBrands[Math.floor(Math.random() * insertedBrands.length)];
      product.brand = brand._id;
    });
  
    const insertedProducts = await Product.insertMany(products);
    console.log('Products Seeded:', insertedProducts);
  
  }
  
  seedDB().then(() => {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  });
  
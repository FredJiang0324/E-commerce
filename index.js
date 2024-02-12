const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
// const favoriteRoutes = require('./routes/favoriteRoutes'); 

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5500' 
}));
app.use(cors());
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('*', (req, res) => {
  res.redirect('/');
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

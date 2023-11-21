const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  price: Number,
  calories: Number,
  category: String,
  alcohol: Number,
});

module.exports = mongoose.model('products', productSchema);

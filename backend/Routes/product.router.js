const express = require('express');
const router = express.Router();
const Product = require('../Models/product.model');
const data = require('../../data');

router.get('/seed', async (req, res) => {
  const products = await Product.insertMany(data.products);
  res.send(products);
});

router.get('/', async (req, res) => {
  const { category } = req.query;
  const products = await Product.find(category ? { category } : {});
  res.send(products);
});

//Creates a new product in the database
router.post('/', async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.send(savedProduct);
});

router.delete('/:id', async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.send(deletedProduct);
});

router.get('/categories', (req, res) => {
  res.send(data.categories);
});

module.exports = router;

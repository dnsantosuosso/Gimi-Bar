const express = require('express');
const router = express.Router();
const Product = require('../Models/product.model');
const data = require('../../src/data');

router.get('/seed', async (req, res) => {
  const products = await Product.insertMany(data.products);
  res.send(products);
});

//TODO: Should be get request. Easy fix converted it to post so static files dont serve first
router.post('/', async (req, res) => {
  console.log('We made the get / request');
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
  console.log('We made the get /categories request');
  res.send(data.categories);
});

module.exports = router;

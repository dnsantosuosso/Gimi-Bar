const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
  bar: { type: mongoose.Schema.Types.ObjectId, ref: 'bars', required: true },
  topPicks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
});

module.exports = mongoose.model('menus', menuSchema);

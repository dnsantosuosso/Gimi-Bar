const mongoose = require('mongoose');
const products = require('./product.model.js');

const Schema = mongoose.Schema;

const adminSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  adminRestaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'bars' }, //specifies where the admin works
  adminRole: String,
  adminTips: Number, //tips that admin has made
  adminRating: Number,
});

//User Model: borrowed code from Sunsational Shades
const userSchema = new Schema(
  {
    name: { type: String, required: true, default: '' },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    adminDetails: [adminSchema],
    loyaltyPoints: { type: Number, required: true },
    pastOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true,
      },
    ],
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
    ],
    profilePhoto: String,
  },
  {
    timestamps: true,
  }
);

//Create Sub-Schema for admins: restaurant, role, tips, efficiency, rating,

//Methods to get cart price of user schema
userSchema.methods.getCartPrice = async (cust) => {
  // console.log("Method A");
  let userCart = await cust.cart;
  let cost = 0;
  for (let i = 0; i < userCart.length; i++) {
    const product = await products.findOne({ _id: userCart[i] }); //finds product with given name
    cost += product.price;
  }
  return cost;
};

userSchema.methods.getCartPriceInLoyaltyPoints = async (cust) => {
  // console.log('We are here');
  let cost = cust.getCartPrice(cust);
  return cost * 10;
};

module.exports = mongoose.model('User', userSchema);

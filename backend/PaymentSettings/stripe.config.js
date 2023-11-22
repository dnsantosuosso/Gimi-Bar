const express = require('express');
const router = express.Router();
const Product = require('../Models/product.model');

const TAX_RATE_ID = 'txr_1O37bEHYpdwksEMu0GF6Azus';

const WEB_URL = 'http://localhost:4000/';
const WEB_URL2 = 'https://gimibar-new-c45af49f0979.herokuapp.com/';

//TODO: Do not hardcode key
const stripe = require('stripe')(
  'sk_test_51NpwZLHYpdwksEMugDUYT2sOySYXivTCdhoxEK8BBYHKKxffXzirb0yy9UnippsJeA0YlfPQIkBZ25dMyeKKCu6900X8djmIIv'
);

//STRIPE
router.post('/create-payment-link', async (req, res) => {
  try {
    const orderItems = req.body.orderItems;
    const orderId = req.body.orderId; // Assuming you send orderId in the request body

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    // Fetch the product details for all the provided order items
    const productIds = orderItems.map((item) => item._id);

    const products = await Product.find({ _id: { $in: productIds } });

    // Convert order items to Stripe line items format
    const lineItems = orderItems.map((item) => {
      const product = products.find((p) => p._id.toString() === item._id);

      if (!product) {
        throw new Error(`Product not found for ID: ${item.product}`);
      }

      const data = {
        price_data: {
          currency: 'cad', // Adjust the currency if needed
          product_data: {
            name: product.name,
            images: [`${BASE_URL}${product.image}`], // Note that `images` expects an array
          },
          unit_amount: product.price * 100, // Stripe wants the price in cents
        },
        quantity: item.quantity,
        tax_rates: [TAX_RATE_ID],
      };

      return data;
    });
    //console.log(JSON.stringify(lineItems, null, 2));

    // Create the payment link using Stripe's API
    const paymentLink = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: WEB_URL2 + `complete?orderId=${orderId}`,
      cancel_url: WEB_URL2, //TODO: Cancel Screen
    });

    return res.json({ url: paymentLink.url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//STRIPE TEST CARD: 4242424242424242

module.exports = router;

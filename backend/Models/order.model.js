const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  },
  name: String,
  quantity: Number,
});

//This is hos the order status should be updated
const OrderStatus = Object.freeze({
  IN_PROGRESS: 'inProgress',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
});

const orderSchema = new mongoose.Schema(
  {
    number: { type: Number, default: 0 },
    orderType: String,
    paymentType: String,
    isPaid: { type: Boolean, default: false },
    isTaken: { type: Boolean, default: false },
    isReady: { type: Boolean, default: false },
    inProgress: { type: Boolean, default: true },
    isCanceled: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    //TODO make enum
    totalPrice: Number,
    taxPrice: Number,
    orderItems: [orderItemSchema],
    bar: { type: mongoose.Schema.Types.ObjectId, ref: 'bars', required: false }, //the bar that the order belongs to (false for now)
    password: String,
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    }, //specifies the bartender that handled the order
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('orders', orderSchema);

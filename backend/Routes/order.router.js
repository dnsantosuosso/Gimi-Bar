const express = require('express');
const Order = require('../Models/order.model');

module.exports = (io) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const lastOrder = await Order.find().sort({ number: -1 }).limit(1);
    const lastNumber = lastOrder.length === 0 ? 0 : lastOrder[0].number; //Handle the case where there are no orders

    if (!req.body.orderItems || req.body.orderItems.length === 0) {
      console.log(req.body.orderType);
      console.log(req.body.paymentType);
      console.log(req.body.orderItems);
      console.log('Data is required');
      return res.send({ message: 'Data is required.' });
    }

    const order = await Order({
      ...req.body,
      // orderType: 'Eat in',
      // paymentType: 'Pay here',
      number: lastNumber + 1,
      bar: req.body.bar,
      password: req.body.password,
    }).save();
    console.log('I think it was saved?');

    try {
      const populatedOrder = await Order.populate(order, {
        path: 'orderItems.product',
      });
      // Emit a real-time event to notify the frontend of the order update
      io.emit('orderUpdated');
      io.emit('queueUpdated');
      res.send({
        ...populatedOrder.toObject(),
        orderId: order._id, // Send the order's _id as orderId
      });
    } catch (error) {
      console.error('Error during population:', error);
      return res.status(500).send({ message: 'Error during order population' });
    }
  });

  router.get('/', async (req, res) => {
    const orders = await Order.find({ isDelivered: false, isCanceled: false });
    res.send(orders);
  });

  router.get('/placed-orders/queue', async (req, res) => {
    try {
      const inProgressOrders = await Order.find(
        { inProgress: true, isCanceled: false },
        'number'
      );
      const servingOrders = await Order.find(
        { isReady: true, isDelivered: false },
        'number'
      );

      // Emit a real-time event to notify the frontend of the order update
      io.emit('orderUpdated');

      res.send({ inProgressOrders, servingOrders });
    } catch (error) {
      console.error('Error fetching queue:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (req.body.action === 'ready') {
        order.isReady = true;
        order.inProgress = false;
      } else if (req.body.action === 'deliver') {
        order.isDelivered = true;
        order.inProgress = false;
        order.isReady = false;
      } else if (req.body.action === 'cancel') {
        order.isCanceled = true;
        order.inProgress = false;
        order.isReady = false;
      } else if (req.body.action === 'paid') {
        order.isPaid = true;
        order.inProgress = true;
      }
      await order.save();

      // Emit a real-time event to notify the frontend of the order update
      io.emit('queueUpdated');
      io.emit('orderUpdated');

      res.send({ message: 'Done' });
    } else {
      req.status(404).send({ message: 'Order not found' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.send(order);
  });

  //Changes status of take
  router.put('/:id/take', async (req, res) => {
    const order = await Order.findById(req.params.id);
    console.log('Taken by ' + req.body.userId);
    if (order) {
      order.isTaken = true;
      order.takenBy = req.body.userId;
      const updatedOrder = await order.save();
      io.emit('orderUpdated');
      res.send(updatedOrder);
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  });

  return router;
};

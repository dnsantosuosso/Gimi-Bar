const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../Models/user.model.js');
const orders = require('../Models/order.model.js');
const products = require('../Models/product.model.js');
const Session = require('../Models/session.model.js');
const { isAuth, isAdmin } = require('../utils/tokenCheck');

const adminRouter = express.Router();

//ROUGH WORK FILE - ADMIN ROUTERS NOT WORKING: Just here for reference. Code is not properly giving sales reports.
//Also, it must be filtered by restaurant of admin running the report. This must be edited (TODO)

//Returns a general sales report displaying the revenue in the past month
adminRouter.get(
  '/run-general-sales-report/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }); //finds customer with given id param

    //Check if user is admin
    if (user.isAdmin) {
      const aggResult = await orders.aggregate([
        // First Stage
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getTime() - 1000 * 3600 * 24 * 30),
              $lt: new Date(),
            },
          },
        },
        //group BY date AS xyz
        // Second Stage
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            totalPrice: { $sum: { $sum: ['$totalPrice'] } },
            count: { $sum: 1 },
          },
        },
        //Third Stage
        {
          $sort: {
            totalPrice: -1,
          },
        },
      ]);

      res.send(aggResult);
    } else {
      res.send('You have to be an admin to run a report on sales');
    }
  })
);

//Returns a specific sales report grouped by individual sunglasses, the quantity sold and the revenue each generated
adminRouter.get(
  '/run-sales-report-specific/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }); //finds customer with given id param
    const month = parseInt(req.body.month);
    const year = parseInt(req.body.year);

    //Check if user is admin
    if (user.isAdmin) {
      const aggResult = await orders.aggregate([
        // Unwind the orderItems array to create a separate document for each item
        { $unwind: '$orderItems' }, //Go through every orderItem document and unwinds (displays in table)

        // Lookup the inventory item for each order item
        {
          $lookup: {
            from: 'inventories',
            localField: 'orderItems',
            foreignField: '_id',
            as: 'item',
          },
        },

        // Unwind the item array to create a separate document for each item
        { $unwind: '$item' },

        // Extract the month and year from the createdAt field
        {
          $addFields: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
        },

        // Filter based on the user input month and year
        {
          $match: {
            month: month,
            year: year,
          },
        },

        // Group by item, month, and year and calculate the quantity and revenue
        {
          $group: {
            _id: { item: '$item._id', month: '$month', year: '$year' },
            quantity: { $sum: 1 },
            revenue: { $sum: { $multiply: ['$item.price', 1.0] } },
          },
        },

        // Lookup the inventory item again to include its fields in the output
        {
          $lookup: {
            from: 'inventories',
            localField: '_id.item',
            foreignField: '_id',
            as: 'item',
          },
        },

        // Unwind the item array to merge it with the group document
        { $unwind: '$item' },

        // Project the output fields
        {
          $project: {
            item: '$item.name',
            month: '$_id.month',
            year: '$_id.year',
            quantity: 1,
            revenue: 1,
            _id: 0,
          },
        },
        //order in descending order (to display the highest revenue at the top)
        {
          $sort: {
            revenue: -1,
          },
        },
      ]);

      res.send(aggResult);
    } else {
      res.send('You have to be an admin to run a report on sales');
    }
  })
);

//Returns a specific sales report grouped by individual sunglasses, the quantity sold and the revenue each generated
adminRouter.post(
  '/run-app-report/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const customer = await User.findOne({ _id: req.params.id }); //finds customer with given id param
    const activeUsers = await Session.count({
      logout: { $exists: false },
    });

    const aggResult = await Session.aggregate([
      {
        $match: {
          logout: { $exists: true },
        },
      },
      {
        $project: {
          customer: 1,
          activeTime: {
            $divide: [{ $subtract: ['$logout', '$login'] }, 60000],
          },
        },
      },
      {
        $group: {
          _id: '$customer',
          totalActiveTime: { $sum: '$activeTime' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: customer._id,
          avgTime: { $avg: '$totalActiveTime' },
        },
      },
      {
        $addFields: {
          activeUsers: activeUsers,
        },
      },
    ]);

    const activeUsersVar = await Session.count({ logout: { $exists: false } });
    res.send(aggResult);

    // const aggResult = await Session.aggregate([
    //   {
    //     $match: {
    //       logout: { $ne: null },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$user',
    //       totalActiveTime: { $sum: { $subtract: ['$logout', '$login'] } },
    //       count: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       avgTime: { $avg: '$totalActiveTime' },
    //       totalActiveUsers: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       avgTime: { $divide: ['$avgTime', 1000 * 60] },
    //       totalActiveUsers: 1,
    //     },
    //   },
    // ]);
    // res.send(aggResult);
  })
);

module.exports = adminRouter;

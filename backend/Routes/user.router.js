const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../Models/user.model.js');
const { isAuth, isAdmin } = require('../utils/tokenCheck.js');
const { tokenGenAndSign } = require('../utils/jwtAuth');
const products = require('../Models/product.model.js');
const Session = require('../Models/session.model.js');
const Product = require('../Models/product.model');

const userRouter = express.Router();

const JWT_COOKIE_EXPIRES = 1;

//post request to login user
userRouter.post(
  '/login',
  expressAsyncHandler(async (req, res) => {
    const customer = await User.findOne({ username: req.body.username });
    // console.log(customer);
    if (customer) {
      if (bcrypt.compareSync(req.body.password, customer.password)) {
        const newToken = tokenGenAndSign(customer);
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          domain: 'localhost',
          httpOnly: false,
          sameSite: 'Lax',
          secure: false,
        };
        // Maybe also add redirect to home here??
        const cook = res.cookie('token', newToken, cookieOptions);

        const session = new Session({
          user: customer,
          login: new Date(),
          //Do not add logout because user has not logged out yet
        });

        //save user's session
        await session.save().then();

        res.send({
          _id: customer._id,
          username: customer.username,
          isAdmin: customer.isAdmin,
          loyaltyPoints: customer.loyaltyPoints,
        });
        return;
      } else {
        return res.status(401).send({
          token: null,
          message: 'Invalid password!',
        });
      }
    } else {
      return res.status(404).send({ message: 'User does not exist' });
    }
  })
);

// //product router
// userRouter.get(
//   '/',
//   expressAsyncHandler(async (req, res) => {
//     console.log('We made the get / request PRODUCT BRO');
//     const { category } = req.query;
//     const products = await Product.find(category ? { category } : {});
//     res.send(products);
//   })
// );

userRouter.post('/bro', (req, res) => {
  console.log('Endpoint /bro accessed');
  res.send('Hello from /bro');
});

//TODO: add email validation. DONE (Test)
//post request to register user
userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const doesUserExist = await User.findOne({
      username: req.body.username,
    });
    if (!doesUserExist) {
      console.log(
        'User does not exist or was not found, so it can be registered!!'
      );
      var pwRegExp = new RegExp(
        /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/
      );
      var emailRegExp = new RegExp(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
      );
      var isEmailLegal = emailRegExp.test(req.body.email);
      var isPwLegal = pwRegExp.test(req.body.password);

      if (isPwLegal && isEmailLegal) {
        const customer = new User({
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 8),
          loyaltyPoints: 0,
          isAdmin: false,
        });

        const createdCustomer = await customer.save().then();
        res.send({
          name: createdCustomer.name,
        });
      } else {
        console.log('Password is illegal');
        return res.status(401).send({
          token: null,
          message: 'Invalid password!',
        });
      }
    } else {
      return res.status(404).send({ message: 'User already exists' });
    }
  })
);

//post request to logout user
userRouter.post(
  '/logout',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const customer = await User.findOne({ _id: req.user._id }); // Use the user ID from the token, not the request body
    console.log('USERNAME ' + req.user.username);
    const session = await Session.findOne({ user: customer })
      .sort('-login')
      .limit(1);
    //finds LAST session of given customer
    session.logout = new Date();
    console.log('We are here');

    // //save user's session
    await session.save().then();

    // Redirect here, just like login
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logged out',
    });
  })
);

//TODO: Test - post request to add item to cart
userRouter.post(
  '/add-to-cart/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const customer = await User.findOne({ _id: req.params.id }); //finds customer with given id param
    var cartCust = customer.cart;
    const product = await products.findOne({ name: req.body.name }); //finds product with given name

    //handle error
    if (product == null) {
      res.send('Cannot add to cart. Please select a valid product');
    }
    //add item to customer's cart
    cartCust.push(product);

    //update database
    await User.updateOne({ _id: customer._id }, { $set: { cart: cartCust } });

    //send entire customer
    res.send(customer);
  })
);

//TODO: Test - post request to remove item from cart
userRouter.post(
  '/remove-from-cart/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const customer = await User.findOne({ _id: req.params.id }); //finds customer with given id param
    var cartCust = customer.cart;
    const product = await products.findOne({ name: req.body.name }); //finds product with given name

    //handle error
    if (product == null) {
      res.send('Cannot remove from cart. Please select a valid product');
    }

    //remove item to customer's cart
    cartCust.remove(product);

    //update database
    await User.updateOne({ _id: customer._id }, { $set: { cart: cartCust } });

    //send entire customer
    res.send(customer);
  })
);

//TODO: Test - post request to show entire customer's cart
userRouter.get(
  '/cart/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const customer = await User.findOne({ _id: req.params.id }); //finds customer with given id param
    var cartCust = customer.cart;

    //send entire customer
    res.send(cartCust);
  })
);

//TODO: Test - post request to change username
userRouter.post(
  '/change-username/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //Before starting: get user by ID
    const customer = await User.findOne({ _id: req.params.id }); //finds customer with given id param

    //First, extract the new username
    const newUsername = req.body.newUsername;

    //Check if newUsername is taken
    const customerFind = await User.findOne({ username: newUsername });

    //if username is not taken
    if (customerFind === null) {
      //Now, update the database
      await User.updateOne(
        { _id: customer._id },
        { $set: { username: newUsername } }
      );
    }

    res.send('New user is: ' + newUsername);
  })
);

//TODO: Test - post request to change Name
userRouter.post(
  '/change-name/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //Before starting: get user by ID
    const customer = await User.findOne({ _id: req.params.id }); //finds customer with given id param

    //First, extract the new name
    const newName = req.body.newName;

    //No need to check if new name is taken: duplicates allowed
    //Update the database
    await User.updateOne({ _id: customer._id }, { $set: { name: newName } });

    res.send('New name is: ' + newName);
  })
);

//TODO: Test - post request to change password
userRouter.post(
  '/change-password/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //Testing: Password: 123Jackie! $2a$08$JcYB/nOYpQNQgSt7MZolWuiqxMAvi451Jgyr5ENQoR8sUUDNoApZC
    //Before starting: get user by ID
    const customer = await User.findOne({ _id: req.params.id }); //finds customer with given id param

    //First, extract the new password1 and password2
    const newPassword1 = req.body.newPassword1;
    const newPassword2 = req.body.newPassword2;

    //Check if both passwords match
    if (newPassword1 === newPassword2) {
      //validate if new password is legal
      var pwRegExp = new RegExp(
        /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/
      );
      var isPwLegal = pwRegExp.test(newPassword1);

      if (isPwLegal) {
        //if new password is legal
        await User.updateOne(
          { _id: customer._id },
          { $set: { password: bcrypt.hashSync(newPassword1, 8) } }
        );
        return res.send('Password updated');
      } else {
        return res.status(401).send({
          message: 'Invalid password!',
        });
      }
    } else {
      res.send('Passwords do not match');
    }
  })
);

module.exports = userRouter;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const data = require('../src/data');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../build')));

// Anything that doesn't match the above, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: [
      'https://gimibar-new-c45af49f0979.herokuapp.com/',
      'http://localhost:4000',
      'http://192.168.0.124:4000', // Add your IP address here
      'http://192.168.5.140:4000', //Presse Cafe IP Address
      'http://192.168.2.32:4000', //Presse Cafe IP Address
    ],
    methods: ['GET', 'POST'],
  },
});

const corsOptions = {
  origin: [
    'https://gimibar-new-c45af49f0979.herokuapp.com/',
    'http://localhost:4000',
  ],
  optionsSuccessStatus: 204,
};

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productRouter = require('./Routes/product.router');
const orderRouter = require('./Routes/order.router');
const stripe = require('./PaymentSettings/stripe.config');
const userRouter = require('./Routes/user.router');
const adminRouter = require('./Routes/admin.router');

app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter(io));
app.use('/api/stripe', stripe);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

module.exports = { app, io };

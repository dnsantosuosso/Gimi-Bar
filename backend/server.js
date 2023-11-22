require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const data = require('../data');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://gimibar-747b6688a2c4.herokuapp.com/',
    ],
    methods: ['GET', 'POST'],
  },
});

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://gimibar-747b6688a2c4.herokuapp.com/',
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

const port = 4000;

// Serve static files from the React frontend app
console.log('DIRNAME IS ' + __dirname);
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../build')));

// Anything that doesn't match the above, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

server.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

module.exports = { app, io };

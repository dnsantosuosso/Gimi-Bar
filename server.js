const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const data = require('./data');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 204,
};

const BASE_URL = 'http://localhost:3000';

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productRoutes = require('./Routes/product.router');
const orderRoutes = require('./Routes/order.router');
const stripe = require('./PaymentSettings/stripe.config');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

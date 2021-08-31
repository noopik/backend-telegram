const express = require('express');
const routes = express();
const userRouter = require('./users');
const productRouter = require('./products');
const categoryRouter = require('./category');
const contactRouter = require('./contacts');
const messageRouter = require('./messages');

routes
  .use('/users', userRouter)
  .use('/products', productRouter)
  .use('/category', categoryRouter)
  .use('/contacts', contactRouter)
  .use('/messages', messageRouter);

module.exports = routes;

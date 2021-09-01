const express = require('express');
const routes = express();
const userRouter = require('./users');
const contactRouter = require('./contacts');
const messageRouter = require('./messages');

routes
  .use('/users', userRouter)
  .use('/contacts', contactRouter)
  .use('/messages', messageRouter);

module.exports = routes;

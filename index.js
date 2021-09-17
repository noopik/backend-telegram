require('dotenv').config();
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const routes = require('./src/routes');
const cors = require('cors');
const { errorHandling, cors: cordMiddleware } = require('./src/middleware');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const app = express();
const httpServer = http.createServer(app);
const socket = require('socket.io');
const { insertMessage } = require('./src/controllers/messageController');
const {
  updateUser,
  updateStatus,
} = require('./src/controllers/usersController');

moment.locale('id');

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
const privateKey = process.env.PRIVATE_KEY;

// Middleware body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());
app.use(morgan('dev'));

// Realtime
const io = socket(httpServer, {
  cors: {
    origin: '*',
  },
});

io.use((socket, next) => {
  // console.log('socket', socket);
  const token = socket.handshake.query.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, privateKey);
      socket.userId = decoded.idUser;
      socket.join(`user:${decoded.idUser}`);
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const error = new Error('token expired');
        error.status = 401;
        console.log(`error`, error);

        return next(error);
      }
      if (err.name === 'JsonWebTokenError') {
        const error = new Error('token invalid');
        error.status = 401;
        console.log(`error`, error);

        return next(error);
      }

      const error = new Error('token not active');
      error.status = 401;
      console.log(`error`, error);

      return next(error);
    }
  }
});

let userActive = [];

io.on('connection', (socket) => {
  console.log(`Client terhubung`, socket.userId);
  // console.log(`ID SOCKET`, socket.id);
  updateStatus(socket.userId, socket.id);

  socket.on('sendMsgFromClient', (data, callback) => {
    insertMessage(data);
    socket.broadcast.to(`user:${data.idReceiver}`).emit('sendMsgFromServer', {
      ...data,
    });
    callback({
      ...data,
      createdAt: moment().format('LT'),
    });
    // console.log('sendMsgFromClient', data);
  });

  // Online status
  socket.on('login', (data) => {
    userActive.push(data.userId);
    socket.emit('onlineStatus', userActive);
  });

  socket.on('disconnect', () => {
    console.log(`Client terputus`, socket.userId);

    userActive = userActive.filter((user) => {
      if (user === socket.userId) {
        return user;
      }
    });
    socket.emit('logout', userActive);
    updateStatus(socket.userId, null);
  });
});

// api routes
app.use('/v1', routes);
app.use('/files', express.static('./public/images'));

app.use((err, req, res, next) => {
  errorHandling(err, req, res, next);
  next();
});

httpServer.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socket = require('socket.io');
const routes = require('./src/routes');
const cors = require('cors');
const { errorHandling } = require('./src/middleware');

const app = express();
const httpServer = http.createServer(app);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;

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

io.on('connection', (socket) => {
  console.log(`Client terhubung`, socket.id);

  socket.on('disconnect', () => {
    console.log(`Client terputus`, socket.id);
  });
});

// api routes
app.use('/v1', routes);
app.use('/files', express.static('./public/images'));

app.use((err, req, res, next) => {
  errorHandling(err, req, res, next);
  next();
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
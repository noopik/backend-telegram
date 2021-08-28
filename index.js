const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const socket = require('socket.io');

const app = express();
const httpServer = http.createServer(app);

// Use middleware cors and morgan
app.use(cors());
app.use(morgan('dev'));

// ROUTING
app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

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

httpServer.listen(4000, () => {
  console.log('Server is running port ' + 4000);
});

require('dotenv').config();
const express = require('express');
const routes = require('./src/routes');
const cors = require('cors');
const { errorHandling } = require('./src/middleware');

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT;

// Middleware body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());

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

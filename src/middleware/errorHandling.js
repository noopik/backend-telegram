const createError = require('http-errors')

const errorHandling = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || new createError.InternalServerError()

  res.status(status).json(createError(status, message))
  next()
}

module.exports = errorHandling

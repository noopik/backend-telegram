const response = (res, statusCode, data, error, message) => {
  const dataResponse = {
    status: message || 'Success',
    statusCode,
    data,
    error: error || null
  }

  res.status(statusCode).json(dataResponse)
}

module.exports = response

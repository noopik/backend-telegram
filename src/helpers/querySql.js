const connection = require('../config/db_connection')

const querySQL = (query, data) => {
  return new Promise((resolve, reject) => {
    connection.query(query, data, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = querySQL

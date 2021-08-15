const { querySQL } = require('../helpers')

module.exports = {
  getAllMethodPayments: () => {
    return querySQL('SELECT * FROM payments')
  },
  getItemMethodPayment: (id) => {
    return querySQL('SELECT * FROM payments WHERE id = ?', id)
  },
  createNewMethodPayment: (data) => {
    return querySQL('INSERT INTO payments SET ?', data)
  },
  updateMethodPayment: (id, data) => {
    return querySQL('UPDATE payments SET ? WHERE id = ?', [data, id])
  },
  deleteMethodPayment: (id) => {
    return querySQL('DELETE FROM payments WHERE id = ?', id)
  }
}

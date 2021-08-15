const querySQL = require('../helpers/querySql')
// const { querySQL } = require('../helpers');

module.exports = {
  paginationModel: (table, field, sortBy, limit, offset) => {
    return querySQL(
      `SELECT * FROM ${table} ORDER BY ${table}.${field} ${sortBy} LIMIT ${limit} OFFSET ${offset}`
    )
  },
  countAllRowsData: (table) => {
    return querySQL(`SELECT COUNT(*) FROM ${table}`)
  }
}

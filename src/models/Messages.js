const { querySQL } = require('../helpers');

module.exports = {
  createMessage: (data) => {
    return querySQL('INSERT INTO messages SET ?', data);
  },
  getMessageById: (idSender, idReceiver) => {
    return querySQL(
      `SELECT * FROM messages where (idReceiver = '${idReceiver}' AND idSender = '${idSender}') OR (idReceiver = '${idSender}' AND idSender = '${idReceiver}') ORDER BY createdAt ASC`
    );
  },
};

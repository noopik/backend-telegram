const { querySQL } = require('../helpers');

module.exports = {
  getAllTransactionModel: async(field, sortBy, limit, offset) => {
    const queryJoinAllTransaction = `
    SELECT 
      transactions.idTransaction, 
      transactions.statusOrder, 
      users.idUser AS 'user id', 
      users.name, 
      users.email, 
      users.phoneNumber, 
      products.id AS 'product id', 
      products.nameProduct, 
      products.price, 
      transactions.quantity, 
      payments.nameBank, 
      transactions.orderDate, 
      transactions.updatedAt 
    FROM transactions 
      INNER JOIN users 
        ON transactions.id_user=users.idUser 
      INNER JOIN products 
        ON transactions.id_name_product=products.id
      INNER JOIN payments 
        ON transactions.id_payment=payments.id`;
    const countDataInRows = await querySQL('SELECT COUNT(*) FROM transactions');

    const countRows = parseInt(Object.values(countDataInRows[0])); // 12

    // value = value || '';
    // field = field || 'updatedAt';
    // sortBy = sortBy || 'DESC';
    // limit = limit || countRows < limit ? 8 : countRows;
    // offset = offset || 0;

    const sortLimitAndMore = `
     ORDER BY ${field} ${sortBy} LIMIT ${limit} OFFSET ${offset}
    `;

    const joinDataTransaction = await querySQL(
      `${queryJoinAllTransaction} ${sortLimitAndMore}`
    );
    // console.log(sortLimitAndMore);
    return { countRows, result: joinDataTransaction };
  },
  getItemTransaction: (idTransaction) => {
    return querySQL(
      `SELECT * FROM transactions WHERE idTransaction = '${idTransaction}'`
    );
  },
  createTransaction: (data) => {
    return querySQL('INSERT INTO transactions SET ?', data);
  },
  updateTransaction: (id, data) => {
    return querySQL('UPDATE transactions SET ? WHERE idTransaction = ?', [
      data,
      id,
    ]);
  },
  deleteTransaction: (id) => {
    return querySQL(`DELETE FROM transactions WHERE id = ${id}`);
  },
  searchProductsModel: async(value, limit, table, field, sortBy, offset) => {
    // console.log(value, limit, table, field, sortBy);
    // check result count searching

    // IN NATURAL LANGUAGE MODE
    // WITH QUERY EXPANSION

    // `SELECT COUNT(*) from ${table} WHERE MATCH(nameProduct, description) AGAINST(${value} WITH QUERY EXPANSION)`

    const getCountRows = await querySQL(
      `SELECT COUNT(*) FROM ${table} WHERE users.name LIKE '%${value}%' OR products.nameProduct LIKE '%${value}%' OR transactions.statusOrder LIKE '%${value}%'`
    );
    // console.log(getCountRows);
    const dataCountRows = getCountRows[0];
    const numDataCountRows = Object.values(dataCountRows)[0];
    // console.log(numDataCountRows);
    // console.log(typeof offset);

    const limitResult = await querySQL(
      `SELECT 
        transactions.idTransaction, 
        transactions.statusOrder, 
        users.idUser AS 'user id', 
        users.name, 
        users.email, 
        users.phoneNumber, 
        products.id AS 'product id', 
        products.nameProduct, 
        products.price, 
        transactions.quantity, 
        payments.nameBank, 
        transactions.orderDate, 
        transactions.updatedAt 
      FROM transactions 
        INNER JOIN users 
          ON transactions.id_user=users.idUser 
        INNER JOIN products 
          ON transactions.id_name_product=products.id
        INNER JOIN payments 
          ON transactions.id_payment=payments.id
      WHERE name 
        LIKE '%${value}%' OR nameProduct LIKE '%${value}%' OR statusOrder LIKE '%${value}%' ORDER BY ${field} ${sortBy} LIMIT ${limit} OFFSET ${offset}`
    );

    // console.log(limitResult);
    // return;
    // totalPage
    const totalPageBefore = numDataCountRows / limit; // 2.374
    const convertMin = parseInt(totalPageBefore.toFixed(0)); // 2
    const convertMax = parseInt(totalPageBefore.toFixed(1)); // 2.3
    let totalPageAfter;

    if (convertMin < convertMax) {
      totalPageAfter = parseInt(convertMin) + 1;
    } else {
      totalPageAfter = parseInt(convertMin);
    }
    // console.log(totalPageAfter);

    // console.log(1, totalPageBefore);
    // console.log(2, convertMin);
    // console.log(3, convertMax);
    // console.log(4, totalPageAfter);

    const dataResponse = {
      totalData: numDataCountRows,
      limit: numDataCountRows > limit ? limit : numDataCountRows,
      totalPage: totalPageAfter,
      data: limitResult,
    };

    // console.log(limitResult.length);
    if (limitResult.length === 0) {
      dataResponse.statusCode = 404;
      dataResponse.errorMessage = 'Page not found';
    }
    return dataResponse;
  },
};
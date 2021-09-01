const { querySQL } = require('../helpers');
module.exports = {
  getAllUsers: async (field, sortBy, limit, offset) => {
    const querySelectAll = 'SELECT * FROM users';

    const countDataInRows = await querySQL('SELECT COUNT(*) FROM users');

    const countRows = parseInt(Object.values(countDataInRows[0]));

    const querySortLimitAndMore = `
    ORDER BY users.${field} ${sortBy} LIMIT ${limit} OFFSET ${offset}
    `;

    const queryAll = await querySQL(
      `${querySelectAll} ${querySortLimitAndMore}`
    );

    return { countRows, result: queryAll };
  },
  searchUsers: async (value, limit, table, field, sortBy, offset) => {
    // console.log(value, limit, table, field, sortBy);
    // check result count searching

    // IN NATURAL LANGUAGE MODE
    // WITH QUERY EXPANSION

    // `SELECT COUNT(*) from ${table} WHERE MATCH(nameProduct, description) AGAINST(${value} WITH QUERY EXPANSION)`

    const getCountRows = await querySQL(
      `SELECT COUNT(*) FROM users WHERE name LIKE '%${value}%' OR email LIKE '%${value}%' OR phone LIKE '%${value}%'`
    );
    // console.log(getCountRows);
    const dataCountRows = getCountRows[0];
    const numDataCountRows = Object.values(dataCountRows)[0];
    // console.log(numDataCountRows);
    // console.log(typeof offset);

    const limitResult = await querySQL(
      `SELECT * FROM users WHERE name LIKE '%${value}%' OR email LIKE '%${value}%' OR phone LIKE '%${value}%' ORDER BY ${field} ${sortBy} LIMIT ${limit} OFFSET ${offset}`
    );

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
  getUserId: (idUser) => {
    return querySQL('SELECT * FROM users WHERE idUser = ?', idUser);
  },

  createUser: (data) => {
    return querySQL('INSERT INTO users SET ?', data);
  },
  updateUser: (idUser, data) => {
    return querySQL('UPDATE users SET ? WHERE idUser = ?', [data, idUser]);
  },
  deleteUser: (idUser) => {
    return querySQL('DELETE FROM users WHERE idUser = ?', idUser);
  },
  getUserEmail: (email) => {
    console.log('email sql', email);
    return querySQL(`SELECT * FROM users WHERE email = '${email}'`);
  },
};

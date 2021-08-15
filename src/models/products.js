const querySQL = require('../helpers/querySql');

module.exports = {
  getAllProductsModel: async(field, sortBy, limit, offset) => {
    //   const queryJoin = `SELECT
    //   products.id,
    //   products.nameProduct,
    //   category.nameCategory,
    //   products.description,
    //   products.price,
    //   products.stock,
    //   products.imageProduct,
    //   products.createdAt,
    //   products.updatedAt
    // FROM products
    //   INNER JOIN category
    //     ON products.id_category=category.id`;
    const queryJoin = `SELECT * FROM products`;

    const countDataInRows = await querySQL('SELECT COUNT(*) FROM products');

    const countRows = parseInt(Object.values(countDataInRows[0]));

    const querySortLimitAndMore = `
    ORDER BY products.${field} ${sortBy} LIMIT ${limit} OFFSET ${offset}
    `;

    const queryAll = await querySQL(`${queryJoin}  ${querySortLimitAndMore}`);

    return { countRows, result: queryAll };
  },
  getItemProductModel: (id) => {
    const queryJoin = `SELECT * FROM products`;

    return querySQL(`${queryJoin} WHERE id = '${id}'`);
  },
  createNewProductModel: (data) => {
    return querySQL('INSERT INTO products SET ?', data);
  },
  updateProductModel: (id, data) => {
    return querySQL('UPDATE products SET ? WHERE id = ?', [data, id]);
  },
  deleteProduct: (id) => {
    return querySQL('DELETE FROM products WHERE id = ?', id);
  },

  searchProductsModel: async(
    value,
    limit,
    table,
    field,
    sortBy,
    offset,
    category
  ) => {
    // console.log(value, limit, table, field, sortBy);
    // check result count searching

    // IN NATURAL LANGUAGE MODE
    // WITH QUERY EXPANSION

    // `SELECT COUNT(*) from ${table} WHERE MATCH(nameProduct, description) AGAINST(${value} WITH QUERY EXPANSION)`

    const getCountRows = await querySQL(
      `SELECT COUNT(*) FROM ${table} WHERE nameProduct LIKE '%${value}%' OR description LIKE '%${value}%'`
    );
    // console.log(getCountRows);
    const dataCountRows = getCountRows[0];
    const numDataCountRows = Object.values(dataCountRows)[0];
    // console.log(numDataCountRows);
    // console.log(typeof offset);

    const queryByCategory = `WHERE category.nameCategory LIKE '%${category}%'`;
    const querySearching = `WHERE nameProduct LIKE '%${value}%' OR description LIKE '%${value}%' OR nameCategory LIKE '%${value}%'`;

    const limitResult = await querySQL(
      `SELECT products.id, products.nameProduct,  category.nameCategory, products.description, products.price, products.stock, products.imageProduct, products.createdAt, products.updatedAt FROM ${table} INNER JOIN category ON products.id_category=category.id ${
        category ? queryByCategory : ''
      } ${
        value ? querySearching : ''
      } ORDER BY ${field} ${sortBy} LIMIT ${limit} OFFSET ${offset}`
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
};
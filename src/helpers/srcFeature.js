const srcFeature = async (req, res, next, model) => {
  const querySrc = req.query.src || '';
  const queryLimit = parseInt(req.query.limit);
  const queryTables = req.baseUrl.substring(1);
  const querySort = req.query.sort || 'DESC';
  const queryPage = req.query.page || 1;
  const queryField = req.query.field || 'updatedAt';
  const categoryQuery = req.query.category || '';
  console.log(categoryQuery);

  const limit = queryLimit || 8;

  // response data
  const dataResponse = {};

  const startIndex = (queryPage - 1) * limit || 0;
  // searching product

  // GET DATA FROM MODELS
  await model(
    querySrc,
    limit,
    queryTables,
    queryField,
    querySort,
    startIndex,
    categoryQuery
  )
    .then((result) => {
      // console.log(result);
      // res.status(200).json(result);
      // return;

      const { totalData, limit, data, totalPage, statusCode, errorMessage } =
        result;
      // totalPage

      dataResponse.meta = {
        keyword: querySrc,
        totalData,
        totalPage: totalPage || 1,
        currentPage: queryPage,
        limit,
        sortBy: `${queryField} ${querySort}`,
      };

      dataResponse.data = data;
      dataResponse.error = {
        statusCode,
        message: errorMessage,
      };
      // console.log(dataResponse);
      res.result = dataResponse;
    })
    .catch(next);
  next();
};

module.exports = srcFeature;

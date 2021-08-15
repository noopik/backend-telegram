const redis = require('redis');
const { response, srcResponse } = require('../helpers');
const client = redis.createClient();

// Hit Cache Product by Id
// eslint-disable-next-line no-unused-vars
const hitCacheProductId = (req, res, next) => {
  const id = req.params.id;
  client.get(`product/${id}`, function(err, data) {
    // Reply is null when the key is missing
    if (data !== null) {
      const result = JSON.parse(data);
      // console.log('result redis get', result);
      return response(res, 200, result);
    }

    next();
  });
};

// HIT CACHE ALL PRODUCTS
const hitCacheAllProducts = (req, res, next) => {
  client.get('allproducts', function(err, data) {
    if (data !== null) {
      const result = JSON.parse(data);
      const { meta, data: dataResult } = result;

      return srcResponse(res, 200, meta, dataResult, {});
    }

    next();
  });
};

const clearRedisProduct = (req, res, next) => {
  client.del('allproducts');
  next();
};

// DELETE CACHE PRODUCTS BY ID
const clearRedisProductById = (req, res, next) => {
  const id = req.params.id;
  client.del(`product/${id}`);
  next();
};

module.exports = {
  hitCacheProductId,
  hitCacheAllProducts,
  clearRedisProduct,
  clearRedisProductById,
};
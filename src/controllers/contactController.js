const { response, srcResponse, srcFeature, pagination } = require('../helpers');
const short = require('short-uuid');

const {
  getAllTransactionModel,
  createContact,
  updateTransaction,
  searchProductsModel,
  getListContact,
} = require('../models/Contact');

module.exports = {
  getAllTransaction: async (req, res, next) => {
    // Pagination data from middleware before
    try {
      if (!req.query.src) {
        // PAGINATION
        if (!req.query.src) {
          const result = await pagination(
            req,
            res,
            next,
            getAllTransactionModel
          );
          // console.log(Object.keys(result));
          const {
            totalPage,
            currentPage,
            limit,
            totalData,
            data,
            error,
            sortBy,
          } = result;
          // console.log(data);

          // console.log(1, totalPage);

          const meta = {
            currentPage,
            totalData,
            limit,
            totalPage,
            sortBy,
          };
          // console.log(2, data.length);
          // return;
          if (data.length === 0) {
            // console.log(error);
            srcResponse(res, 404, meta, {}, error, error);
          } else {
            srcResponse(res, 200, meta, data);
          }
        }
      }
      // SEARCHING
      // Belum selesai. BUG QUERY SQL
      if (req.query.src) {
        srcFeature(req, res, next, searchProductsModel).then(() => {
          // console.log(Object.keys(res.result));
          const { data, meta, error } = res.result;
          if (error.statusCode && error.message) {
            srcResponse(
              res,
              error.statusCode,
              meta,
              {},
              error.message,
              error.message
            );
          } else {
            srcResponse(res, 200, meta, data, {});
          }
        });
      }
    } catch (error) {
      next(error);
    }

    // getAllTransaction()
    //   .then((result) => {
    //     const data = result;
    //     res.status(200).json(data);
    //   })
    //   .catch(next);
  },
  getListContactId: (req, res) => {
    const idUser = req.params.id;
    // console.log(idUser);
    getListContact(idUser)
      .then((result) => {
        response(res, 200, result);
      })
      .catch((err) => {
        response(res, 404, {}, err);
      });
  },
  createContact: (req, res, next) => {
    const { idUser, idFriend } = req.body;
    const uid = short.generate();

    const data = {
      idContact: `${idUser}_${idFriend}`,
      idUser,
      idFriend,
    };

    createContact(data)
      .then(() => {
        response(res, 200, {}, {}, 'Success add friend');
      })
      .catch(next);
  },
  updateItemTransaction: (req, res, next) => {
    const { quantity, idPayment, statusOrder } = req.body;
    const id = req.params.id;

    const updateItemTransaction = {
      idTransaction: id,
      quantity,
      id_payment: idPayment,
      statusOrder,
      updatedAt: new Date(),
    };

    updateTransaction(id, updateItemTransaction)
      .then(() => {
        // console.log(result);
        response(res, 200, {}, {}, 'Success updated transaction');
      })
      .catch(next);
  },
  deleteItemTransaction: () => {},
};

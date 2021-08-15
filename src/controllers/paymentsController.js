const { response } = require('../helpers');
const PaymentsModel = require('../models/payments');

const {
  getAllMethodPayments,
  getItemMethodPayment,
  createNewMethodPayment,
  updateMethodPayment,
  deleteMethodPayment,
} = PaymentsModel;

module.exports = {
  getAllMethod: (req, res) => {
    getAllMethodPayments()
      .then((result) => {
        const data = result;
        // console.log();
        response(res, 200, data, {}, 'Success get all method payments');
      })
      .catch((err) => {
        // console.log(err);
        response(res, 500, {}, err, 'Error to get all method payments');
      });
  },
  getItemMethod: (req, res) => {
    const id = req.params.id;
    getItemMethodPayment(id)
      .then((result) => {
        const data = result;
        response(res, 200, data, {}, 'Success get method item');
      })
      .catch((err) => {
        response(res, 500, {}, err, 'Error get method item');
      });
  },
  createNewMethodItem: (req, res) => {
    const { nameBank } = req.body;
    const data = { nameBank };
    createNewMethodPayment(data)
      .then(() => {
        // console.log(result);
        response(res, 200, {}, {}, `Success created ${data}`);
      })
      .catch((err) => {
        response(res, 500, {}, err, `Failed to created method ${data}`);
      });
  },
  updateMethodItem: (req, res) => {
    const { nameBank } = req.body;
    const id = req.params.id;
    const data = {
      nameBank,
    };
    updateMethodPayment(id, data)
      .then(() => {
        // console.log(result);
        response(res, 200, {}, {}, `Success update method ${data.nameBank}`);
      })
      .catch((err) => {
        // console.log(err);
        response(res, 500, {}, err, `Failed to update method ${data.nameBank}`);
      });
  },
  deleteMethodItem: (req, res) => {
    const id = req.params.id;
    deleteMethodPayment(id)
      .then(() => {
        // console.log(result);
        response(res, 200, {}, {}, 'Deleted success');
      })
      .catch((err) => {
        response(res, 500, {}, err, 'Failed to delete!');
      });
  },
};
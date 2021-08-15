const express = require('express');
const {
  createItemTransaction,
  getAllTransaction,
  updateItemTransaction,
  getItemTransaction,
} = require('../controllers/transactionController');
const { verifyAccess, sellerAccess } = require('../middleware/auth');
const router = express.Router();

router
  .get('/', verifyAccess, sellerAccess, getAllTransaction)
  .post('/', verifyAccess, sellerAccess, createItemTransaction)
  .get('/:id', verifyAccess, sellerAccess, getItemTransaction)
  .post('/:id', updateItemTransaction, verifyAccess, sellerAccess)
  .delete('/:id');

module.exports = router;
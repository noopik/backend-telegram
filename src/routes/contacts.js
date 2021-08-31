const express = require('express');
const {
  createContact,
  getAllTransaction,
  updateItemTransaction,
  getListContactId,
} = require('../controllers/contactController');
const { verifyAccess, sellerAccess } = require('../middleware/auth');
const router = express.Router();

router
  .get('/', verifyAccess, getAllTransaction)
  .post('/', verifyAccess, createContact)
  .get('/:id', verifyAccess, getListContactId)
  .post('/:id', updateItemTransaction, verifyAccess, sellerAccess)
  .delete('/:id');

module.exports = router;

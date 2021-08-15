const express = require('express');
const categoryController = require('../controllers/categoryController');
const { verifyAccess, superAccess } = require('../middleware/auth');
const router = express.Router();
const { uploadFile } = require('../middleware/multer');

const {
  createCategory,
  getAllCategory,
  getItemCategory,
  updateCategory,
  deleteCategory,
} = categoryController;

router
  .get('/', getAllCategory)
  .post(
    '/',
    verifyAccess,
    superAccess,
    (req, res, next) => uploadFile(req, res, next, 'image'),
    createCategory
  )
  .get('/:id', verifyAccess, superAccess, getItemCategory)
  .post(
    '/:id',
    verifyAccess,
    superAccess,
    (req, res, next) => uploadFile(req, res, next, 'image'),
    updateCategory
  )
  .delete('/:id', verifyAccess, superAccess, deleteCategory);

module.exports = router;
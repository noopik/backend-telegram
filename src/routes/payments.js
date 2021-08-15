const express = require('express')
const {
  createNewMethodItem,
  getAllMethod,
  getItemMethod,
  updateMethodItem,
  deleteMethodItem
} = require('../controllers/paymentsController')

const router = express.Router()
router
  .get('/', getAllMethod)
  .post('/', createNewMethodItem)
  .get('/:id', getItemMethod)
  .post('/:id', updateMethodItem)
  .delete('/:id', deleteMethodItem)

module.exports = router

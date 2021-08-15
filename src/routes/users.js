const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { verifyAccess } = require('../middleware/auth');
const { uploadFile } = require('../middleware/multer');

router
  .get('/', verifyAccess, userController.getAllUsers)
  .get('/verify-token', verifyAccess, userController.verifyTokenUser)
  .post('/register', userController.createUser)
  .post('/login', userController.loginUser)
  .post('/forgot-password', userController.getUserByEmail)
  .patch('/change-password/:id', verifyAccess, userController.updatePassword)
  .get('/:id', verifyAccess, userController.getUserId)
  .patch(
    '/:id',
    verifyAccess,
    (req, res, next) => uploadFile(req, res, next, 'avatar'),
    userController.updateUser
  )

.delete('/:id', verifyAccess, userController.deleteUser);

module.exports = router;
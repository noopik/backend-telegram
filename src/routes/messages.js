const express = require('express');
const router = express.Router();
const { getMessageById } = require('../controllers/messageController');
const { verifyAccess } = require('../middleware/auth');

router.get('/:idReceiver', verifyAccess, getMessageById);

module.exports = router;

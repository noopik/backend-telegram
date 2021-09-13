const { response } = require('../helpers');
const Message = require('../models/Messages');
const short = require('short-uuid');
const { getMessageById, getLastMessageById } = require('../models/Messages');

const { createMessage } = Message;
const moment = require('moment');
moment.locale('id');

module.exports = {
  insertMessage: (data) => {
    const uid = short.generate();

    const postData = {
      idMessage: uid,
      bodyMessage: data.body,
      idSender: data.idSender,
      idReceiver: data.idReceiver,
      idContact: `${data.idSender}_${data.idReceiver}`,
      createdAt: new Date(),
    };
    createMessage(postData)
      .then((res) => {
        // console.log('insert message to BD success: ', res);
      })
      .catch((err) => {
        // console.log('err insert message: ', err);
      });
  },
  getMessageById: (req, res, next) => {
    const idReceiver = req.params.idReceiver;
    // console.log('idReceiver', idReceiver);
    // console.log('req.userId', req.userId);
    getMessageById(req.userId, idReceiver)
      .then((result) => {
        response(res, 200, result);
      })
      .catch((err) => {
        response(res, 404, {}, {}, 'History not found');
      });
  },
  getLastMessageById: (req, res, next) => {
    const idReceiver = req.params.idReceiver;
    // console.log('idReceiver', idReceiver);
    // console.log('req.userId', req.userId);
    getLastMessageById(req.userId, idReceiver)
      .then((result) => {
        response(res, 200, result);
      })
      .catch((err) => {
        response(res, 404, {}, {}, 'History not found');
      });
  },
};

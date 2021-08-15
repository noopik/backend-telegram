const nodemailer = require('nodemailer');
const bodyMail = require('./bodyMail');

const verifiedEmail = (emailTo, nameTo, token) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      // eslint-disable-next-line no-undef
      user: process.env.EMAIL_SERVICE, // generated ethereal user
      // eslint-disable-next-line no-undef
      pass: process.env.PASS_EMAIL_SERVICE, // generated ethereal password
    },
  });

  transporter
    .sendMail({
      // eslint-disable-next-line no-undef
      from: `CEO Blanja.com | ${process.env.EMAIL_SERVICE}`, // sender address
      to: emailTo, // list of receivers
      subject: 'Blanja.com | Email Verification', // Subject line
      html: bodyMail(token, nameTo), // html body
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = verifiedEmail;
const nodemailer = require('nodemailer');
const ENV = require('../utils/Env');

const transporter = nodemailer.createTransport(
  {
    host: ENV.getOrFail("MAIL_HOST"),
    port: ENV.getOrFail("MAIL_PORT"),
    auth: {
      user: ENV.getOrFail("MAIL_USER"),
      pass: ENV.getOrFail("MAIL_PASS"),
    },
    logger: true,
    transactionLog: true // include SMTP traffic in the logs
  },
  {
    from: ENV.getOrFail("MAIL_FROM"),
    headers: {
      'X-author': "https://www.marikaday.com/"
    }
  }
);

module.exports = transporter

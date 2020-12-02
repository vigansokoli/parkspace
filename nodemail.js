"use strict";
const nodemailer = require("nodemailer");
const {smtp,url} = require("./config");

// async..await is not allowed in global scope, must use a wrapper
async function mail(user, message) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: smtp.server,
    port: smtp.port,
    secure: true, // true for 465, false for other ports
    auth: {
      user: smtp.username, // generated ethereal user
      pass: smtp.password, // generated ethereal password
    }
  });

  var mailOptions = {
    to: user.email,
    from: 'vigan.sokoli@gmail.com',
    subject: 'Node.js Password Reset',
    text: message
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions, function(err) {

    console.log(err);
    return( 'An e-mail has been sent to ' + user.email + ' with further instructions.');
    done(err, 'done');
  });

  console.log("Message sent: %s", info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);

module.exports = {mail: mail};

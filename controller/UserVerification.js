const {h4:uuidv4} = require("uuid")
require('dotenv').config()
const nodemailer = require("nodemailer")

// variables .env
const email = process.env.AUTH_EMAIL;
const pwd = process.env.AUTH_PASSWORD;
const key = '2c3df0c0565cc8ba2dc3ed40d69ab40b-77316142-f1d419cc'
// --------------------------------------- USER VERIFICATION CODE -------------------------------------------------------------

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f1ba4cc13c5aed",
    pass: "0246564e53d3c2"
  }
});

// Email options
const mailOptions = {
  from: email,
  to: 'fedi.benromdhane@esprit.tn', // Replace with recipient's email address
  subject: 'Sending Email using Node.js',
  text: 'hello im comming wait for me!',
}
 
// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
 

  //--------------------------------------------SIGN UP ADMIN-----------------------------------------------------------
  
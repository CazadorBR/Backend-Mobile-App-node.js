 const nodemailer = require("nodemailer");
 const { log, error } = require('console');
 const nodemailer = require("nodemailer")
 const bcrypt = require('bcrypt')
 const UserVerification = require('../model/UserVerification')
 // unique string 
 const {h4:uuidv4} = require("uuid");
 const userverification = require("../model/UserVerification");
// variables .env
 const email_S = process.env.AUTH_EMAIL;
  // --------------------------------------- USER VERIFICATION CODE -------------------------------------------------------------
const  sendVerificationEmail = ({_id,email},res) => {
const  CURRENT_URL = "http://127.0.01:3000";
const  UNIQUE_STRING = uuidv4()+_id;

 // mail options
    const  Mail_Option = {
    from: email_S,
    to: email, // Replace with recipient's email address
    subject: 'Verify your email',
    html: `<p> verify your  email adress to complete the sign up into your account.</p>
           <p> this link  <b> expires in 6 hours</b>.</p>
           <p> Press <a href=${CURRENT_URL+"/verify"+_id+"/"+UNIQUE_STRING}>HERE</a>
               To proceed.</p>`,
    };

     /// to Do ----------------------

    //  hach the unique string 
    const saltRounds = 10
    bcrypt.hash(UNIQUE_STRING,saltRounds)
          .then((hashedUniqueString) => {
   
            // creat a instance for userverification CLASS to add attribute
                const newverification = UserVerification({
                  UserID : _id,
                  uniqueString: hashedUniqueString, 
                  createdAt :Date.now(),
                  expiredAt :Date.now()+21600000  //6 hours     
                })
           // Save uservarification data 
                newverification.save()
                               .then(()=>{
                                      transporter
                                          .sendMail(Mail_Option)
                                          .then(()=>{
                                            res.json({
                                              status : Pending ,
                                              message :"Email verification was sent ! Check it !!"
                                            })
                                          })
                                          .catch((error) =>{
                                            console.log(error);
                                            res.json({
                                              status: "Failed",
                                              message: "Couldn't send mail  verification !!"
                                            })
                                // send email with nodemailer tranporter 
                               })
                               .catch((error) =>{
                                console.log(error);
                                res.json({
                                  status: "Failed",
                                  message: "Couldn't save  verification Email Data!"
                                })
                               }) 
         })
          .catch((error) =>{
            console.log(error);
            res.json({
              status: "Failed",
              message: "An error was occured while hashing email data !"
            })
           }) 
} )
}

// var transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "f1ba4cc13c5aed",
//     pass: "0246564e53d3c2"
//   }
// });

// // Email options
// const mailOptions = {
//   from: email,
//   to: 'fedi.benromdhane@esprit.tn', // Replace with recipient's email address
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!',
// }
 
 

   
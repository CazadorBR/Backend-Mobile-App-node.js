 
const { log, error } = require('console');
const express = require('express');
const app = express();
const morgan = require("morgan")
 app.use(morgan('dev'))

//  ------------------------------------------Require Entity ------------------------------------------
const User = require('../model/User')
const UserVerification = require('../model/UserVerification')
const BlackList = require('../model/BlackList')
// -------------------------------------------Congiuration ------------------------------------------
require('dotenv').config();
const path = require('path')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


const nodemailer = require("nodemailer")
const {v4:uuidv4} = require("uuid");
 

const email = process.env.AUTH_EMAIL;
const pwd = process.env.AUTH_PASSWORD;
const key = '2c3df0c0565cc8ba2dc3ed40d69ab40b-77316142-f1d419cc'
const email_S = process.env.AUTH_EMAIL;
const secretKey = process.env.SECRET_KEY;


// --------------------------------------- USER VERIFICATION CODE -------------------------------------------------------------
// ----------A  ne pas modfidier!!!!!!!!--------------------
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f1ba4cc13c5aed",
    pass: "0246564e53d3c2"
  }
});
// ------------------------------------------------------------
// Email options
const mailOptions = {
  from: email,
  to: 'fedi.benromdhane@esprit.tn', // Replace with recipient's email address
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
}

// TEST  MAILLING
 transporter.verify((error,succes)=>{
  if(error){
    console.log(error);
  }else {
    console.log("Ready to send Mails");
    console.log(succes);
  }
})
// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
 ///    --------------- JWT ------CONFIGURATION---------------
//   console.log(secretKey);
  // const secrect_key = "MaCleSecrete123";

 // tranporter.verify((error,succes)=>{
//   if(error){
//   console.log("erreur de connection "+error);
//   }else{
//     console.log("Ready to send mails");
//     console.log(succes);
//   }
// })
const EXPIRED_TOKEN = 3 * 24 * 60 * 60
const CreateToken =  (id) => {
return jwt.sign({id},secretKey,{expiresIn: EXPIRED_TOKEN})
}

//--------------------------------------------SEND VERIFICATION MAIL -----------------------------------------------------------
  
  module.exports.verificationMail = (req,res) =>{
        let{userId} = req.params;
         
        UserVerification
            .find({UserID:userId})
            .then(()=>{
              // if(result.length > 0){
              //   console.log(result.length);
                // const {expiresAt} = result[0]
                // const hashedUniqueString = result[0].uniqueString
              //  if(expiresAt < Date.now()){
              //   console.log(UserVerification);
              //   UserVerification.deleteOne({userId})
              //                   .then(result =>{
              //                         User.deleteOne({_id:userId})
              //                         .then(()=>{
              //                           let message = "Link has expired Please sign up again ";
              //                           res.redirect(`/verified/error=true&message=${message}`)
              //                         })
              //                         .catch((error)=>{
              //                           console.log(error);
              //                           let message = "An error was occured while expired unique string failed ";
              //                           res.redirect(`/verified/error=true&message=${message}`)
              //                         })
              //                       })
              //                   .catch((error)=>{
              //                     console.log(error);
              //                     let message = "An-error-was-occured-while-clearing-expired-user ";
              //                     res.redirect(`/verified/error=true&message=${message}`)
                  
              //                   })
              //   }
              //   // result doesn't expired 
              //   else{
                  console.log("----------------------------------");
                  // valis record exist// compare the hashed inque string  
                //  bcrypt.compare(uniqueString,hashedUniqueString)
                      // .then(result =>{
                        //  if(result){
                           User.updateOne({ _id: userId},{verified : true})
                              .then(()=>{
                                console.log(User);
                                 UserVerification.deleteOne({UserID:userId})
                                                .then(()=>{
                                                //  res.redirect('/verified')
                                                res.sendFile(path.join(__dirname,"../View/verifyYouMail.html"))
                                                 })
                                                 .catch((error)=>{
                                                  console.log(error);
                                                  let message = "An-error-occured-while-finalizing-succeful-verification";
                                                  res.redirect(`/verified/error=true&message=${message}`)
                                                 })     
                               })
                              .catch(error =>{
                                    console.log(error);
                                    let message = "Invalid-verification-details-passed . Check-your-inbox";
                                    res.redirect(`/verified/error=true&message=${message}`)
                          })

                        //  }else{
                        //   let message = "Invalid verification details passed . Check your inbox";
                        //   res.redirect(`/verified/error=true&message=${message}`)
                        //  }
                      })
                    
                


            //    }
            //    else{
            //     let message = "Account-record-doesn't-exist-or-has-been-verified-already. pleasee-sign-uo-or-log-In !! ";
            //     res.redirect(`/verified/error=true&message=${message}`)

            //   }
            // })
            .catch((error)=>{
              console.log(error);
              let message = "An error was occured while  checking  for existing User verification  record !! ";
              res.redirect(`/verified/error=true&message=${message}`)

       })

  }
    // ---------------------------------------------  REDIRECT TO PAGE MAIL VERIFIED --------------------------------------------------

  module.exports.FileVerification = (req,res)=>{
    res.sendFile(path.join(__dirname, "../View/verifyYouMail.html"));
  }
  // ---------------------------------------------  SIGN UP ADMIN --------------------------------------------------
  module.exports.signup_Amdin = async (req, res) => {
    const { email, password ,name} = req.body;

    try{
      //  const user = await User.create({email,password,name,role:'admin',verified:false})
      //                         .then((result)=>{
      //                           sendVerificationEmail(result,res)
      //                         })
      const newUser = new User({
        email,
        password,
        name,
        image:`${req.protocol}://${req.get('host')}/img/${req.file.filename}`,
        role:"admin",
        verified:false
      });
      console.log("filename"+req.file.filename);

       newUser.save()
              .then((result)=>{
                console.log(result);
                sendVerificationEmail({ _id: result._id, email: result.email },res)
                
              })
              .catch((err)=>{
                console.log(err);
                res.json({
                  status:"Failed",
                  message :" An error was occured while saving User"
                })
              })



       const token = CreateToken(newUser._id)
       console.log(" user  token : "+ token);
       newUser.token = token;
      // res.status(201).json({User:newUser });

    }catch(error){
            console.log(error);
            res.status(400).send("Bad request so Admin not created")
    }
  }
  //---------------------------------------------------USER SIGN UP -------------------------------------------------

  module.exports.signup_User = async (req, res) => {
    const { email, password ,name} = req.body;

    try{
      //  const user = await User.create({email,password,name,role:'admin',verified:false})
      //                         .then((result)=>{
      //                           sendVerificationEmail(result,res)
      //                         })
      const newUser = new User({
        email,
        password,
        name,
        image: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`,
        role:"user",
        verified:false
      });

       newUser.save()
              .then((result)=>{
                console.log(result);
                sendVerificationEmail({ _id: result._id, email: result.email },res)
                
              })
              .catch((err)=>{
                console.log(err);

                res.json({
                  status:"Failed",
                  message :" An error was occured while saving User"
                })
              })



       const token = CreateToken(newUser._id)
       console.log(" user  token : "+ token);
       newUser.token = token;
      //  res.status(201).json(newUser);

    }catch(error){
            console.log(error);
            res.status(400).send("Bad request so User not created")
    }
  }
 // ----------- LOGIN--------------------------------
  module.exports.SignIn = async (req, res) => {
 
    try {
        const { email, password } = req.body;
    
        if (!(email && password)) {
          res.status(400).send("All input is required");
        }
        const user = await User.findOne({ email });

        if(!(user.verified)){
          res.json({
            status :"Failed",
            message :"Email hasn't been Verified , Verify your inbox!"
          })
       }else{
           if (user && (await bcrypt.compare(password, user.password))) {
        // PAYLOAD:je place dans le payload du jwt  id_user + Email + Role
        const token = jwt.sign( { user_id: user._id,role: user.role, email },secretKey,{expiresIn: EXPIRED_TOKEN,} );
         user.token = token;
        res.status(200).json(user);
      }
    }
        
        res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }  
 }
     //------------VERIFY USER LOGIN----------------
    //  module.exports.Verify = async (req, res) => {
    //     res.status(200).json("Successfully Logged");
    //  } 
         //-------------------------------------------Logout----------------------------------------------------------------------

    module.exports.logout = async (req,res)=>{
      
        const header = req.header('Authorization');

        // console.log(header)
        if (!header) 
        return res.sendStatus(204);  
        
        else  {
        const accessToken = header.split(' ')[1];  
        // console.log(accessToken)
        const checkIfBlacklisted = await BlackList.findOne({ token: accessToken }); // Check if that token is blacklisted
        if (checkIfBlacklisted)return res.sendStatus(204);
          else{
         // otherwise blacklist token
        const newBlacklist = new BlackList({  token: accessToken });
        
        await newBlacklist.save();
       res.status(200).json({ message: 'You are logged out!' });
      }
      }
    
    }
     
     
    
         //-------------------------------------------TEST----------------------------------------------------------------------

  module.exports.test = async (req,res) =>{
    res.status(200).json("you are logged");
  }
   
     module.exports.verifyRole = async (req, res) => {
      res.status(200).json(" you have the authority good luck");
   }
     
    
// Funtion SEND mail VERIFICATION
   const  sendVerificationEmail = ({_id,email},res) => {
    const  CURRENT_URL = "http://localhost:3000/";
    // const  uniqueString = uuidv4()+_id;
      
     // mail options
        const  Mail_Option = {
        from: email_S,
        to: email, // Replace with recipient's email address
        subject: 'Verify your email',
        html: `<p> Please Verify your  <b>Email adress</b> to complete the sign up into your account.</p>
               <p> this link  <b> expires in 6 hours</b>.</p>
               <div style="font-family: inherit; text-align: center"><span style="color: #ffbe00; font-size: 18px">
               <p> Press <a href=${CURRENT_URL+"verify/"+_id}>HERE</a>
               </span></div><div></div></div></td>

                   To proceed.</p>`,
        };
    
         /// to Do ----------------------
    
        //  hach the unique string 
        // const saltRounds = 10
        // bcrypt.hash(uniqueString,saltRounds)
        //       .then((hashedUniqueString) => {
       
                // creat a instance for userverification CLASS to add attribute
                    const newverification = UserVerification({
                      UserID : _id,
                      // uniqueString: hashedUniqueString, 
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
                                                  status : "Pending",
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
              // .catch((error) =>{
              //   console.log(error);
              //   res.json({
              //     status: "Failed",
              //     message: "An error was occured while hashing email data !"
              //   })
              //  }) 
    // } )
    }
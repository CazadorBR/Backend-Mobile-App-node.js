// controller actions

const { log, error } = require('console');
const User = require('../model/User')
const UserVerification = require('../model/UserVerification')
const BlackList = require('../model/BlackList')
require('dotenv').config();
const path = require('path')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
  
// user verification CONFIG
//email handler
const nodemailer = require("nodemailer")
// unique string 
const {h4:uuidv4} = require("uuid")
 // variables .env
const email = process.env.AUTH_EMAIL;
const pwd = process.env.AUTH_PASSWORD;
const key = '2c3df0c0565cc8ba2dc3ed40d69ab40b-77316142-f1d419cc'
// etape 1 install  nodemailer + uuid + injection des dependances 
// create a node mailer tranporter



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
  const secretKey = process.env.SECRET_KEY;
//   console.log(secretKey);
  // const secrect_key = "MaCleSecrete123";
 const EXPIRED_TOKEN = 3 * 24 * 60 * 60
 const CreateToken =  (id) => {
return jwt.sign({id},secretKey,{expiresIn: EXPIRED_TOKEN})
}

 // tranporter.verify((error,succes)=>{
//   if(error){
//   console.log("erreur de connection "+error);
//   }else{
//     console.log("Ready to send mails");
//     console.log(succes);
//   }
// })
//--------------------------------------------SEND VERIFICATION EMAIL-----------------------------------------------------------
  
  module.exports.verificationMail = (req,res) =>{
        let{userId,uniquestring} = req.params;
        UserVerification
            .find({userId})
            .then()
            .catch((error)=>{
              console.log(error);
              let message = "An error was occured while  checking  for existing User verification  record !! "
       })

  }
  module.exports.FileVerification = (req,res)=>{
          
  }
  // ---------------------------------------------  SIGN UP ADMIN --------------------------------------------------
  module.exports.signup_Amdin = async (req, res) => {
    const { email, password ,name} = req.body;

    try{
       const user = await User.create({email,password,name,role:'admin'});

       const token = CreateToken(user._id)
       console.log(" user  token : "+ token);
       user.token = token;
      //  res.cookie('JWT',token,{hhtpOnly:true,EXPIRED_TOKEN:EXPIRED_TOKEN *1000 });
       res.status(201).json(user);

    }catch(error){
            console.log(error);
            res.status(400).send("Bad request so Admin not created")
    }
  }
  //---------------------------------------------------USER SIGN UP -------------------------------------------------

  module.exports.signup_User = async (req, res) => {
    const { email, password ,name} = req.body;

    try{
       const user = await User.create({email,password,name,role:'user'});

       const token = CreateToken(user._id)
       console.log(" user  token : "+ token);
       user.token = token;
       res.status(201).json(user);

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
    
        if (user && (await bcrypt.compare(password, user.password))) {
  

          // PAYLOAD:je place dans le payload du jwt  id_user + Email + Role
          const token = jwt.sign( { user_id: user._id,role: user.role, email },secretKey,{expiresIn: EXPIRED_TOKEN,} );
           user.token = token;
          res.status(200).json(user);
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
     
    
const User = require('../model/User')
const Code = require('../model/CodeVerification')

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const path = require('path')
const nodemailer = require("nodemailer")

 
// const JWT_secret = process.env.SECRET_KEY;
const email_S = process.env.AUTH_EMAIL;

const JWT_secret = 'some super secret.....'
const CreateToken =  (id) => {
    return jwt.sign({id},secretKey,{expiresIn: EXPIRED_TOKEN})
    }

    // ----------A  ne pas modfidier!!!!!!!!--------------------
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f1ba4cc13c5aed",
    pass: "0246564e53d3c2"
  }
});
transporter.verify((error,succes)=>{
  if(error){
    console.log(error);
  }else {
    console.log("Ready to send verification code");
    console.log(succes);
  }
})

module.exports.forgot_password = async (req, res,next) => {
 
    try {
        const { email } = req.body;
    
        if (!(email )) {
          res.status(400).send("All input is required");
        }
        const user = await User.findOne({ email });
        const codesent =   Code.find( user.id );
       
        if(email !== user.email){
          res.json({
            status :"Failed",
            message :"You are not registred!"
        
          }) 
       }else{

        const secret = JWT_secret + user.password;
       
        const payload = {
            email: user.email,
            id:user._id,
            codesent: codesent.code 

           }

        const token = jwt.sign(payload,secret,{expiresIn:'15m'})
        const link =`http://localhost:3000/reset-password/${user._id}/${token}`
        console.log(link)
          res.send({ message:'Password reset link was sent check it .now.. !!',
          Token: token
             }) 
            // sendVerificationEmail(email)
            // const  sendVerificationEmail = ({_id,email},res) => {
              sendVerificationEmail({ _id: user._id, email:email },res)
          }
        
        res.status(400).send("Invalid Credentials");
     
      } catch (err) {
        console.log(err);
      }  
 }

 module.exports.reset_user_password = async (req,res)=>{
    const{Userid} = req.params
    Code.find({id:Userid})
        .then(()=>{
          
        })

  }


 module.exports.reset_password_View  = async (req, res,next) => {
 
    const{id,token}=req.params
    console.log(req.params);
    const user = await User.findById(id);
    console.log(user );
    
    const secret = JWT_secret+ user.password
    try {
        const payload = jwt.verify(token ,secret)
        res.sendFile(path.join(__dirname,"../View/reset-password.html"))
   }catch (error) {
        console.log(error.message);
            res.send(error.message)
   }
     
} 

    module.exports.reset_password  = async (req, res,next) => {
      const{id,token} = req.params
      const{password,code} = req.body

    if (!(password)&& !(code)) {
        res.status(400).send("those input are required");
      }
      else{
         

          try {
                const user = await User.findById(id);
                console.log(" Pwd before reset  :"+user.password);
                const secret = JWT_secret + user.password;
                const payload = jwt.verify(token ,secret)
                
               const codetaped = Code.find({id:user.id})
                    .then(()=>{
                      if(codetaped === code ){
                        const hashedPassword =  bcrypt.hash(password, 10);

                          user.updateOne({password : hashedPassword})
                                  .then(
                                   res.status(200).send({message:"Password has been succefully reseted",
                                   User:user})
                                 //  Code.deleteOne({id:id})
                                   )
                             .catch(res.status(400).send({message:"User undefined"}) )
                      }

                 })

               
          } catch (error) {
                console.log(error.message);
                    res.send(error.message)
            }
    }

    }

//---------------------------------------- SEND VERIFICATION CODE  AND SAVE IT ------------------------------------------------------
    const  sendVerificationEmail = ({_id,email},res) => {
       // Generate  random verification code  
       const verificationCode = Math.floor(1000 + Math.random() * 9000);

              const  Mail_Option = {
              from: email_S,
              to: email, 
              subject: 'verfication code',
              text: `Votre code de vérification est : ${verificationCode}`
              };
              const code = Code({
                UserID : _id,
                code :verificationCode
              })
                         code.save()
                             .then(()=>{
                                    transporter
                                        .sendMail(Mail_Option)
                                        .then(()=>{
                                          res.json({status : "Pending",
                                                    message :"Code verification was sent check your Email"
                                                   })
                                        })
                                     
           
                            }
    )}
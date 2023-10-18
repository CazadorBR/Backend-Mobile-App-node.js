const User = require('../model/User')
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const path = require('path')

 
// const JWT_secret = process.env.SECRET_KEY;

const JWT_secret = 'some super secret.....'
const CreateToken =  (id) => {
    return jwt.sign({id},secretKey,{expiresIn: EXPIRED_TOKEN})
    }

module.exports.forgot_password = async (req, res,next) => {
 
    try {
        const { email } = req.body;
    
        if (!(email )) {
          res.status(400).send("All input is required");
        }
        const user = await User.findOne({ email });

        if(email !== user.email){
          res.json({
            status :"Failed",
            message :"You are not registred!"
        
          })
       }else{

        const secret = JWT_secret + user.password;
        const payload = {
            email: user.email,
            id:user._id
        }

     const token = jwt.sign(payload,secret,{expiresIn:'15m'})
     const link =`http://localhost:3000/reset-password/${user._id}/${token}`
     console.log(link)
     res.send({ message:'Password reset link was sent check it .now.. !!',
       Link:link
        }) 
           
    }
        
        res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }  


     

 }

 module.exports.reset_password_View  = async (req, res,next) => {
 
    const{id,token}=req.params
    console.log(req.params);
    const user = await User.findById(id);
    console.log(user );
    //invalid id
    // if(id !== user._id){
    //     res.send('invalid id .....!!')
    // }
    const secret = JWT_secret+ user.password
    try {
      
        const payload = jwt.verify(token ,secret)
        res.sendFile(path.join(__dirname,"../View/reset-password.html"))
    } catch (error) {
        console.log(error.message);
            res.send(error.message)
   }
     



} 
    module.exports.reset_password  = async (req, res,next) => {
      const{id,token}=req.params
      const{password} =req.body

    if (!(password )) {
        res.status(400).send("this input is required");
      }
    const user = await User.findById(id);
    // res.send(user)
    const secret = JWT_secret + user.password;
    try {
        const payload = jwt.verify(token ,secret)
        user.password = password

        res.send({message:" password has been succefully changed ",
          User:user
      })
    } catch (error) {
        console.log(error.message);
            res.send(error.message)
    }

    }
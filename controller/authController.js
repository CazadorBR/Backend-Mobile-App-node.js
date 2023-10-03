// controller actions

const { log } = require('console');
const User = require('../model/User')
const jwt = require('jsonwebtoken');
require('dotenv').config();
 
  ///    --------------- JWT ------CONFIGURATION---------------
  const secretKey = process.env.SECRET_KEY;
  console.log(secretKey);
  // const secrect_key = "MaCleSecrete123";
 const EXPIRED_TOKEN = 3 * 24 * 60 * 60
 const CreateToken =  (id) => {
return jwt.sign({id},secretKey,{expiresIn: EXPIRED_TOKEN})
}

 
//-----------------------------------------------------------

module.exports.signup_get = (req, res) => {
    res.render('signup');
  }
  
  module.exports.login_get = (req, res) => {
    res.render('login');
  }
  // ------------------  SIGN -- UP -- USER -----------
  module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try{
       const user = await User.create({email,password});

       const token = CreateToken(user._id)
       console.log(" user  token : "+ token);
       res.cookie('JWT',token,{hhtpOnly:true,EXPIRED_TOKEN:EXPIRED_TOKEN *1000 });
       res.status(201).json(token);

    }catch(error){
            console.log(error);
            res.status(400).send("Bad request so User not created")
    }
  }

  module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
  
    try {

      const user = await User.login(email, password);
      const token_loged_in = CreateToken(user._id);
      res.header('Authorization', `Bearer ${token_loged_in}`);

      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

      res.status(200).json({ user: user._id , token :token_loged_in});
    } catch (err) {
      res.status(400).json({});
    }
   
 }
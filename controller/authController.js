// controller actions

const { log } = require('console');
const User = require('../model/User')
const jwt = require('jsonwebtoken');
  ///    --------------- JWT ------CONFIGURATION---------------
const EXPIRED_TOKEN = 3 * 24 * 60 * 60
const CreateToken =  (id)=> {
return jwt.sign({id},'secret information',{
    expiresIn: EXPIRED_TOKEN
})
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
    res.send('user login');
  }

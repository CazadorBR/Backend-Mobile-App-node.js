// controller actions

const { log } = require('console');
const User = require('../model/User')
const BlackList = require('../model/BlackList')

const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt')
  
 ///    --------------- JWT ------CONFIGURATION---------------
  const secretKey = process.env.SECRET_KEY;
//   console.log(secretKey);
  // const secrect_key = "MaCleSecrete123";
 const EXPIRED_TOKEN = 3 * 24 * 60 * 60
 const CreateToken =  (id) => {
return jwt.sign({id},secretKey,{expiresIn: EXPIRED_TOKEN})
}

 
//-----------------------------------------------------------

// module.exports.signup_get = (req, res) => {
//     res.render('signup');
//   }
  
 
  // ------------------  SIGN -- UP -- USER -----------
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
  //---------------------USER SIGN UP--------------------------------------

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
     
    
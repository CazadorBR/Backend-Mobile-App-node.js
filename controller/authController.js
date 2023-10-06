// controller actions

const { log } = require('console');
const User = require('../model/User')
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
       res.cookie('JWT',token,{hhtpOnly:true,EXPIRED_TOKEN:EXPIRED_TOKEN *1000 });
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
       res.cookie('JWT',token,{hhtpOnly:true,EXPIRED_TOKEN:EXPIRED_TOKEN *1000 });
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
  
          const token = jwt.sign( { user_id: user._id, email },secretKey,{expiresIn: EXPIRED_TOKEN,} );
           user.token = token;
          res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }  
 }
     //------------VERIFY USER LOGIN----------------
     module.exports.Verify = async (req, res) => {
        res.status(200).json("Successfully Logged");
     }

  //    module.exports.test = async (req, res) => {
  //     res.status(200).json("Successfully Logged");
  //  }
     module.exports.verifyRole = async (req, res) => {
      res.status(200).json(" you have the authority good luck");
   }
     
    //  module.exports.currentUser = async (req, res) => {
    //         const header = req.header('Authorization');
        
    //         console.log(header); // tested succefully
    //         const token = header.split(' ')[1]; // esubster barear + espace
    //         console.log('------------------'); // tested succefully
    //         console.log(token); // tested succefully
        
    //         if (token) {
           
    //         const decoded = jwt.verify(token,secretKey);
    //         console.log(decoded);
    //         let user =   User.findById(decoded.id)
    //        // res.locals.user = user 
    //         res.status(200).json({ Email :user.email })
        
    //         } else { 
    //             res.locals.user =null
    //             res.status(404).json("Not found")
    //         }
           
           
    //  }
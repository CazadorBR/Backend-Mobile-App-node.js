const jwt = require("jsonwebtoken");
require('dotenv').config(); // Chargez les variables d'environnement
const User = require('../model/User')

const secretKey = process.env.SECRET_KEY;

//-------------VERIFY CONECTIVTY----------------
const verifyToken = (req, res, next) => {

    const header = req.header('Authorization');
    // console.log(header); // tested succefully
    const token = header.split(' ')[1]; // esubster barear + espace
    console.log('------------------'); // tested succefully
    // console.log(token); // tested succefully
  
    if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  else{
    const decoded = jwt.verify(token,secretKey);
    console.log(decoded);
    req.user = decoded;
    next();
    }
   
  return next();
  };

  //-------------VERIFY ROLE----------------

// const verifyRole = (req ,res, next)=>{
 
//     const header = req.header('Authorization');
//     console.log(header); // tested succefully
//     const token = header.split(' ')[1];
//     if(!token){
//         res.status(400).json("U should enter a token")
//     }else
//     try {
//       const decodedToken = jwt.verify(token, 'secretKey');
//       // decodedToken contient les informations du payload, y compris le rôle de l'utilisateur
      
//       if (decodedToken.role !== 'admin') {
//           res.status(401).json(' you are not authorized to view this !!!')
//       } else {
//         req.user = decoded;
//         next();
//       }
//   } catch (error) {
//      res.status(501)
//   }
    
  
//   }
  
  module.exports =  verifyToken  ;
 

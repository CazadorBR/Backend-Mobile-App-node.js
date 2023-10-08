

 const jwt = require("jsonwebtoken");
require('dotenv').config(); // Chargez les variables d'environnement
const User = require('../model/User')

const secretKey = process.env.SECRET_KEY;


//-------------VERIFY ROLE----------------

const verifyRole = (req ,res, next)=>{
 
  const header = req.header('Authorization');
  // console.log(header); // tested succefully
  const token = header.split(' ')[1];
   
  try {
    const decodedToken = jwt.verify(token, secretKey);
    console.log("Email   :" + decodedToken.email,"role  :" +  decodedToken.role);

    if (decodedToken.role == "admin") {
        res.status(200).json(' you are allowed  to view this !!!')
        req.user = decoded;
        next();
    } else {
      res.status(401).json(' you are  not allowed  to view this !!!')

     
    }
} catch (error) {
   res.status(501)
}
  

}
 module.exports =  verifyRole  ;
 
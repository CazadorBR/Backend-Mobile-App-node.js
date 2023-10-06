

 const jwt = require("jsonwebtoken");
require('dotenv').config(); // Chargez les variables d'environnement
const User = require('../model/User')

const secretKey = process.env.SECRET_KEY;

//-------------VERIFY CONECTIVTY----------------
const verifyToken = (req, res, next) => {

  const header = req.header('Authorization');
  console.log(header); // tested succefully
  const token = header.split(' ')[1]; // esubster barear + espace
  console.log('------------------'); // tested succefully
  console.log(token); // tested succefully

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

const verifyRole = (req ,res, next)=>{
 
  const header = req.header('Authorization');
  console.log(header); // tested succefully
  const token = header.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, 'secretKey');
    // decodedToken contient les informations du payload, y compris le rôle de l'utilisateur
    
    if (decodedToken.role !== 'admin') {
        res.status(401).json(' you are not authorized to view this !!!')
    } else {
      req.user = decoded;
      next();
    }
} catch (error) {
   res.status(501)
}
  
//     if (token) {
   
//       const decoded = jwt.verify(token,secretKey);
//       let user = User.findById(decoded.id)
//       const role = user.role
//       console.log(role);
//       if(role!=='admin'){
//       res.status(401).json('You are not authorized to view this.')
//       }
//       next();
    
// }
}
module.exports =  verifyToken  ;
module.exports =  verifyRole  ;

// const getCurrnetUser = (req, res, next) => {

//     const header = req.header('Authorization');
//     console.log(header); // tested succefully
//     const token = header.split(' ')[1]; // esubster barear + espace
//     console.log('------------------'); // tested succefully
//     console.log(token); // tested succefully

//     if (token) {
   
//     const decoded = jwt.verify(token,secretKey);
//     console.log(decoded);
//     let user =   User.findById(decoded.id)
//     res.locals.user = user 
//     res.status(200).json(user.email)
//     next();

//     } else { 
//         res.locals.user =null
//         res.status(404).json("Not found")
//         next()
//     }
   
//   return next();
// }; 



// module.exports =  getCurrnetUser  ;
 
//------------------------------
// const jwt = require('jsonwebtoken');
// require('dotenv').config(); // Chargez les variables d'environnement

// const requireAuth = (req, res, next) => {
//   const token = req.header('Authorization');

//   const SECRET_KEY = process.env.SECRET_KEY

//   // Vérifie si le token est présent
  
//   if (token) {
//     jwt.verify(token,SECRET_KEY, (err, decodedToken) => {
//       if (err) {
//         // console.log(err,token);
//         res.status(401).json({ error: 'Token invalide' });
//       } else {
//         req.user = decodedToken;
//         next();
//       }
//     });
//   } else {
//     res.status(401).json({ error: 'Token non fourni' });
//   }
// };

// module.exports = { requireAuth };

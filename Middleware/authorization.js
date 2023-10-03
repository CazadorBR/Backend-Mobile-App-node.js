

const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
require('dotenv').config(); // Chargez les variables d'environnement

const secretKey = process.env.SECRET_KEY;

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

module.exports = verifyToken;
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

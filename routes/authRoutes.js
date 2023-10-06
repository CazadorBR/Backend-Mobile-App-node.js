 const { Router } = require('express');
 const authController = require('../controller/authController');
 const User = require('../model/User')
 require('dotenv').config(); // Chargez les variables d'environnement
 const bcrypt = require('bcrypt')
 const jwt = require('jsonwebtoken');
 const router = Router();


// -----------Middleware--------------
 const verifyToken  = require('../Midllware/authorization'); // Importez la fonction requireAuth comme middleware
 const getCurrnetUser  = require('../Midllware/authorization'); // Importez la fonction requireAuth comme middleware
 const verifyRole  = require('../Midllware/authorization'); // Importez la fonction requireAuth comme middleware

 const secretKey = process.env.SECRET_KEY;
 const EXPIRED_TOKEN = 3 * 24 * 60 * 60
  router.post('/signupA', authController.signup_Amdin);
  router.post('/signupU', authController.signup_User);
  router.post('/SignIn', authController.SignIn);

  router.get('/midllewarAuth', verifyToken,authController.Verify);  
  router.get('/midllewareRole' ,verifyRole, authController.verifyRole);
  // router.get('/test', verifyToken,authController.test);  


  router.get('/test', verifyToken, (req, res) => {
    res.status(200).json("vous étes connecté");
}); 
module.exports = router;





//  router.post("/signIn", async (req, res) => {

//     try {
//       const { email, password } = req.body;
  
//       if (!(email && password)) {
//         res.status(400).send("All input is required");
//       }
//       const user = await User.findOne({ email });
  
//       if (user && (await bcrypt.compare(password, user.password))) {

//         const token = jwt.sign(
//           { user_id: user._id, email },
//           secretKey,
//           {
//             expiresIn: EXPIRED_TOKEN,
//           }
//         );
//          user.token = token;
//         res.status(200).json(user);
//       }
//       res.status(400).send("Invalid Credentials");
//     } catch (err) {
//       console.log(err);
//     }
//     // Our register logic ends here
//   });
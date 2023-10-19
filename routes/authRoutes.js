 const { Router } = require('express');
 const authController = require('../controller/authController');
 const reset_password = require('../controller/Reset_passowrd');

 require('dotenv').config(); // Chargez les variables d'environnement
 const router = Router();


// ------------Middleware--------------
 const verifyToken  = require('../Midllware/Authmiddleware');  
 const verifyRole  = require('../Midllware/IsAdmin');  


 //--------------VARIABLES-------------------
 const secretKey = process.env.SECRET_KEY;
 const EXPIRED_TOKEN = 3 * 24 * 60 * 60

 //--------------Principal Routes------------
  router.post('/signupA', authController.signup_Amdin);
  router.post('/signupU', authController.signup_User);
  router.post('/SignIn', authController.SignIn);
  router.get('/logout', authController.logout);

 //--------------Forget -/- Reset Password Routes------------
//  router.get('/forgot-passowrd', reset_password.forgot_password_View);
 router.post('/forgot-password',  reset_password.forgot_password);
 router.get('/reset-password/:id/:token',reset_password.reset_password_View)
 router.post('/reset-password/:id/:token',reset_password.reset_password);



//---------------Sending Verification Mail----------------------
  router.get('/verify/:userId',authController.verificationMail)
  router.get('/verified',authController.FileVerification)

  // ------------Testting Routes-------------
  router.get('/authMid',verifyToken, authController.test);
  router.get('/IsAdmin' ,verifyRole, authController.verifyRole); 

 // router.get('/test', verifyToken,authController.test);  


 
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
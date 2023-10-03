const { Router } = require('express');
const authController = require('../controller/authController');
 const verifyToken  = require('../Middleware/authorization'); // Importez la fonction requireAuth comme middleware
 const User = require('../model/User')
 require('dotenv').config(); // Chargez les variables d'environnement
 const bcrypt = require('bcrypt')
 const jwt = require('jsonwebtoken');

 // const secrect_key = "MaCleSecrete123";
 const secretKey = process.env.SECRET_KEY;
//  console.log(secretKey);
const router = Router();
const EXPIRED_TOKEN = 3 * 24 * 60 * 60
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

router.post("/signIn", async (req, res) => {

    try {
      const { email, password } = req.body;
  
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {

        const token = jwt.sign(
          { user_id: user._id, email },
          secretKey,
          {
            expiresIn: EXPIRED_TOKEN,
          }
        );
         user.token = token;
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  


router.get('/test', verifyToken, (req, res) => {
    res.status(200).json("vous étes connecté");
});  
module.exports = router;
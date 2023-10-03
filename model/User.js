const { log } = require('console');
const mongoose = require('mongoose');
const  {isEmail} = require('validator') 
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
require('dotenv').config();

const EXPIRED_TOKEN = 3 * 24 * 60 * 60
const secretKey = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true , 'Please enter a  Email'  ],
    unique: true,
    lowercase: true,
    validate:[isEmail,'Please enter a valid   Email']
  },
  password: {
    type: String,
    required: [true , 'Please enter a valid Email'  ],
    minlength: 6,
  },
  token: {
     type: String 
    },

});

// MONGOOS HOOK
userSchema.post('save',function(doc,next){
    console.log("new user was created and saved ",doc);
    next();
})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password ,salt)
     console.log("new user  about  to be created and saved ",this);
    next();
})
// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({ _id: this._id },secretKey,{expiresIn: EXPIRED_TOKEN});
//     return token;
// };

// static methode to login user 
// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };

const User = mongoose.model('user', userSchema);
module.exports = User;
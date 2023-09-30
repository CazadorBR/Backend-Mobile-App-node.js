const { log } = require('console');
const mongoose = require('mongoose');
const  {isEmail} = require('validator') 
const bcrypt = require('bcrypt')


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
  }
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

const User = mongoose.model('user', userSchema);
module.exports = User;
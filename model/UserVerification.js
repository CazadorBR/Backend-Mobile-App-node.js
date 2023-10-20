

const mongoose = require('mongoose')
const userverificationSchema = new mongoose.Schema({
   
    UserID : String,
    
    // uniqueString: String, 
    createdAt :Date,
    expiredAt :Date      
    
    
  });
  const Userverification = mongoose.model('Userverification', userverificationSchema);
  module.exports = Userverification;
 
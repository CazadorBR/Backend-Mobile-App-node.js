

const mongoose = require('mongoose')
const userverificationSchema = new mongoose.Schema({
   
    UserID : String,
    uniqueString: String, 
    createdAt :Date,
    expiredAt :Date      
    
    
  });
  const userverification = mongoose.model('userverification', userverificationSchema);
module.exports = userverification;
 
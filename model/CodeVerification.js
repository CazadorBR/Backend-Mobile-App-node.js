

const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema(
    {
        UserID :{
         type:   String,
         unique: true,
        },
        code : Number
      },
    );

const verificationCode = mongoose.model('code', CodeSchema);
module.exports = verificationCode;
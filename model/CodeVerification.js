

const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema(
    {
        UserID : String,
        code : Number
      },
    );

const verificationCode = mongoose.model('code', CodeSchema);
module.exports = verificationCode;
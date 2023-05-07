const mongoose = require('mongoose');

// schema for password reset if use forgets there and request for password reset using forget password feature. 
const resetAccessToken = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required: true
    },
    access_token: {
        type : String,
        required: true
    },
    isValid : {
        type: Boolean,
        required : true,
    }
},{
    timestamps: true,
});

const Token = mongoose.model('Token', resetAccessToken);

module.exports = Token;
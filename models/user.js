const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');   // install bcryptjs to save hashed password in db rather than orginal password.
// open below link to get more info on bcryptjs usage https://coderrocketfuel.com/article/store-passwords-in-mongodb-with-node-js-mongoose-and-bcrypt

const UserSchema = new mongoose.Schema({
    email: {
        type : String,
        required: true,
        unique: true
    },
    password: {
        type : String,
        required: true
    },
    name:{
        type : String,
        required: true
    }
},{
    timestamps: true
}
);

//pre is a mongoose middleware which calls the callback function before changing/updating a document in user collection.
UserSchema.pre("save", function(next){
    const user = this;  //this will hold the current instance of userSchema

    if(this.isModified("password") || this.isNew){
        bcrypt.genSalt(10, function(saltError, salt){
            if(saltError){
                return next(saltError);
            }
            else{
                bcrypt.hash(user.password, salt, function(hashError, hash){
                    if(hashError){
                        return next(hashError);
                    }
                    else{
                        user.password = hash;
                        next();
                    }
                });
            }
        });
    }
    else{
        return next();
    }
});

UserSchema.methods.comparePassword = async function(password, callback){
    try {
        const isMatched = await bcrypt.compare(password, this.password);
        return callback(null, isMatched);
    } catch (error) {
        return callback(error);        
    }
};

const User = mongoose.model('Users', UserSchema);

module.exports = User;
const passport = require('passport');
const User = require('../models/user');

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
async function(req, email, password, done){
    try {
        let user = await User.findOne({email: email});
        // console.log("user", user);
        if(user!==null){
            user.comparePassword(password, function(matchError, isMatch){
                if(matchError){
                    return done(matchError);
                }
                else if(!isMatch){
                    req.flash('error', 'Invalid email/password!');
                    return done(null, false);
                }
                else{
                    return done(null, user);
                }
            });
        }else{
            req.flash('error', 'Email does not exist!');
            return done(null,false);
        }
    } catch (error) {
        return done(error);
    }
}
));

passport.serializeUser(function(user, done){
    done(null, user._id);
});

// deserialize the user from the key in the session-cookies
passport.deserializeUser(async function(id, done){
    try {
        let user = await User.findById(id);
        return done(null, user);
    } catch (error) {
        console.log('Error in finding user --> Passport');
        return done(err);
    }
});

passport.checkAuthentication = function(req, res, next){

    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated())
    {
        res.locals.user = req.user;
    }
    
    next();
};

module.exports = passport;
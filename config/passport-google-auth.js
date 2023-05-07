const passport = require('passport');
const crypto = require('crypto');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const env = require('./environment');

// configuring google authentication using passportjs  

passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_url
    },
    async function(accesToken, refreshToken, profile, done){  //callback function will be after authentication is done from google using aboe credentials(clienid, secret...)
        try {
            let user = await User.findOne({email: profile.emails[0].value});
            if(user){
                return done(null, user);
            }
            else{
                let newUser = await User.create({
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    name: profile.displayName
                });

                return done(null, newUser);
            }
            
        } catch (error) {
            console.log("Passport err", error);
            return;
        }
    }
))

module.exports = passport;
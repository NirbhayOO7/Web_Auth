const User = require('../models/user');
const Token = require('../models/reset_access_token');
const crypto = require('crypto');
const Mailer = require('../mailers/reserPassword_mailer');

// render sign up page
module.exports.signup = function(req, res){
    if(req.isAuthenticated())
    {
        req.flash('error', 'You are already logged in!');
        return res.redirect('/');
    }
    return res.render('signup', {
        title: "Sign Up"
    });
}

//render sing in page
module.exports.signin = function(req, res){
    if(req.isAuthenticated())
    {
        req.flash('error', 'You are already logged in!');
        return res.redirect('/');
    }
    return res.render('signin', {
        title: "Sign In"
    });
}

// function to create user in our local database 
module.exports.create = async function(req, res){

    if(req.body.password !== req.body.confirm_pass){
        // console.log('password and confirm password does not macth');
        req.flash('error', 'Password and Confirm Password doesnot match!');
        return res.redirect('back');
    }

    try{
        const user = await User.findOne({email: req.body.email});

        if(!user){
            const newUser = await User.create(req.body);
            console.log('User created!')
            req.flash('success', 'User id created!');
            return res.redirect('/user/sign-in');
        }
        else{
            console.log("User already exist!");
            req.flash('error', 'User account already exist!');
            return res.redirect('/user/sign-in');
        }
    }
    catch(err){
        console.log("Error creating user", err);
    }

}

// function to createsession(signing in) for our user 
module.exports.createSession = function(req, res){
    req.flash('success', 'Successfully logged In!');
    return res.redirect('/');
}

// function for logging out the user 
module.exports.destroySession = function(req, res){
    // req.logout is a function of passport js 
    req.logout(function(err){
        if(err){
            console.log('Error while logging out of the session')
        }

        req.flash('success', 'You have logged out!')
        return res.redirect('/');
    });
}

// function to render forget password page
module.exports.forgetPassword = (req, res)=>{
    return res.render(
        'forget_password',{
        title: 'Rest Password',
        });
}

//function to reset password action
module.exports.resetPassword = async function(req, res){
    try {
        let user = await User.findOne({email: req.body.email});
        // console.log("user", user);
        if(user){
            let resetToken = await Token.create({
                user: user._id,
                access_token: crypto.randomBytes(20).toString('hex'),
                isValid: true
            });

            resetToken = await resetToken.populate([{path:'user', select:'name email'}]);

            Mailer.resetPassword(resetToken);
            req.flash('success', 'Please check your mail to reset password');
            return res.redirect('/');
        }
        else{
            req.flash('failure', 'User account does not exist!');
            return res.redirect('/');
        }
        
    } catch (error) {
        console.log('error creating reset access token', error);
        return;
    }
}

// render the form for changing password using link sent on email 
module.exports.changePassword =async function(req, res){
    try{
        let accessToken = await Token.findOne({access_token: req.params.id});
            // console.log('access token', accessToken);
            return res.render('changePassword_form',{
                title: 'Change your password',
                accessToken: accessToken
        });
    }catch(err){
        req.flash('error',err);
        console.log('Error rendering change password form', err);
        return res.redirect('back');
    }
}

// once user submit the new password with confirm password below action would take place 
module.exports.submitChangePassword = async function(req, res){
    
    try{
        if(req.body.password == req.body.confirm_password){

            let accessToken = await Token.findOne({access_token: req.params.id}).populate('user');
            
            if(accessToken.isValid){
                accessToken.user.password = req.body.password;

                accessToken.isValid = false;
                accessToken.user.save();
                accessToken.save();

                req.flash('success', 'Password changed successfully');
                return res.redirect('/user/sign-in');
            }
        }
        else{
            req.flash('error', 'password and confirm password does not match');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error',err);
        console.log('Error', err);
        return res.redirect('back');
    }

}

// change password after signed in
module.exports.changePassword1 =  async function(req, res){
    let user = await User.findById(req.params.id);
    user.password = req.body.password;
    user.save();

    req.flash('success', 'Password changed successfully');
    return res.redirect('/');
} 
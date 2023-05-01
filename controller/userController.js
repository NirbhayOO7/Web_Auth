const User = require('../models/user');

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

module.exports.createSession = function(req, res){
    req.flash('success', 'Successfully logged In!');
    return res.redirect('/');
}

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
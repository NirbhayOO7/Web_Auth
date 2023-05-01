const User = require('../models/user');

// render sign up page
module.exports.signup = function(req, res){
    return res.render('signup', {
        title: "Sign Up"
    });
}

//render sing in page
module.exports.signin = function(req, res){
    if(req.isAuthenticated())
    {
        console.log('already logged in');
        return res.redirect('/');
    }
    return res.render('signin', {
        title: "Sign In"
    });
}

module.exports.create = async function(req, res){

    if(req.body.password !== req.body.confirm_pass){
        console.log('password and confirm password doesnot macth');
        return res.redirect('back');
    }

    try{
        const user = await User.findOne({email: req.body.email});

        if(!user){
            const newUser = await User.create(req.body);
            console.log('User created!')

            return res.redirect('/user/sign-in');
        }
        else{
            console.log("User already exist!");
            return res.redirect('/user/sign-in');
        }
    }
    catch(err){
        console.log("Error creating user", err);
    }

}

module.exports.createSession = function(req, res){
    return res.redirect('/');
}
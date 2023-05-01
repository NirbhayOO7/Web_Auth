const express = require('express');
const app = express();
const port = 8000;
const path = require('path');                       // path in inbuilt module of express
const bodyParser = require('body-parser');         // body-parser module is used to decrypt the form data as form data.
const mongoose = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passport-local-auth');
const flash = require('connect-flash');                             
const customMware = require('./config/middleware');


//set app to look for static files in assets folder
app.use(express.static('./assets'));

// setup layout for your application
app.use(expressLayouts);

// extract styles and scripts from sub pages into the layout 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// middleware used to decode the encrypted data with the help of bodyparser 
app.use(bodyParser.urlencoded({extended: false}));

// setting up the view key in app object to views folder
app.set('views', path.join(__dirname, 'views'));

// setting up view engine object key is app to ejs
app.set('view engine', 'ejs');

app.use(session({
    name: 'socailcode',
    secret: 'randomtext',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge : (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/Web_auth',
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);


app.use(flash());
app.use(customMware.setFlash);


//setting up express router
app.use('/',require('./routes'));   //it by default fetch up the ./routes/index.js


app.listen(port, function(err){
    if(err){
        console.log("Error starting server:", err);
    }

    console.log("Server is running over port:" , port);
})

const express = require('express');
const app = express();
const port = 8000;
const path = require('path');                       // path in inbuilt module of express
const bodyParser = require('body-parser');         // body-parser module is used to decrypt the form data as form data.
const mongoose = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');


// setup layout for your application
app.use(expressLayouts);

// middleware used to decode the encrypted data with the help of bodyparser 
app.use(bodyParser.urlencoded({extended: false}));

// setting up the view key in app object to views folder
app.set('views', path.join(__dirname, 'views'));

// setting up view engine object key is app to ejs
app.set('view engine', 'ejs');


//setting up express router
app.use('/',require('./routes'));   //it by default fetch up the ./routes/index.js


app.listen(port, function(err){
    if(err){
        console.log("Error starting server:", err);
    }

    console.log("Server is running over port:" , port);
})

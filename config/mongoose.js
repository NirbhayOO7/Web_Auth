const mongoose = require('mongoose');
let db;

main().catch(err => console.log('Error connecting to MongoDB Web_Auth',err));

// setting up mongoose configuration 
async function main(){

    await mongoose.connect('mongodb://localhost/Web_auth');
    db = mongoose.connection;
    console.log('Connected to Database :: MongoDB');
} 

module.exports = db;

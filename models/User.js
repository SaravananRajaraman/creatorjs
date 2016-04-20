var config = require('../config.js');
//console.log(config);

// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UsersSchema   = new mongoose.Schema({
    username: { type: String, lowercase: true },
    email: { type : String , unique : true, required : true },
    password: { type : String , required : true },
    userId: { type : String , required : true },
    isVerify: { type: Boolean }
});

// Export the Mongoose model
module.exports = mongoose.model(config.dbConfig.collections.user, UsersSchema);

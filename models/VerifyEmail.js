var config = require('../config.js');
//console.log(config);

var mongoose = require('mongoose');

// Define our beer schema
var VerifyEmail   = new mongoose.Schema({
    email: { type : String , unique : true, required : true },    
    token: { type : String , unique : true, required : true }
});

// Export the Mongoose model
module.exports = mongoose.model(config.dbConfig.collections.verifyEmail, VerifyEmail);
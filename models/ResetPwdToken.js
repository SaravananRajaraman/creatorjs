var config = require('../config.js');
//console.log(config);

// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var ResetPwdTokenSchema   = new mongoose.Schema({
    email: { type : String , required : true },
    token: { type : String , required : true },
    expire: { type : String , required : true }
});

// Export the Mongoose model
module.exports = mongoose.model(config.dbConfig.collections.resetPwdToken, ResetPwdTokenSchema);

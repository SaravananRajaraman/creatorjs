var config = require('../config.js');
//console.log(config);

// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var TrackSchema   = new mongoose.Schema({
    eventName: String,
    userProp: {},
    TrackEProp:{}
});


// Export the Mongoose model
module.exports = mongoose.model(config.dbConfig.collections.tracke, TrackSchema);
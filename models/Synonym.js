/**
 * Created by HP on 9/5/2015.
 */
// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var synonymSchema   = new mongoose.Schema({
    lsd: { type : String , unique : true, required : true },
    rsd: { type : String , required : true }
});

// Export the Mongoose model
module.exports = mongoose.model('synonyms', synonymSchema);

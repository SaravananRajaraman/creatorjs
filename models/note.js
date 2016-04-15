/**
 * Created by HP on 9/5/2015.
 */
// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var noteSchema   = new mongoose.Schema({    
    // email: { type : String , unique : true, required : true },
    userId: String,
    noteId: String,
    note: String,
    type: String    
});

// Export the Mongoose model
module.exports = mongoose.model('notes', noteSchema);

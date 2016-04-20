var config = require('../config.js');
//console.log(config);

// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var NoteSchema   = new mongoose.Schema({        
    userId: { type : String , required : true },
    noteId: { type : String , required : true , unique : true},
    noteTitle: { type : String , required : true },
    note: { type : String , required : true },
    type: { type: String }    
});

// Export the Mongoose model
module.exports = mongoose.model(config.dbConfig.collections.notes, NoteSchema);

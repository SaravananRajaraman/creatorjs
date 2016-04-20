var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var crypto = require('crypto');


var Note = require('../models/Note');

//Todo: Use cross Domain in global
router.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, X-Requested-With');
    next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Saravanan');
});

// parse application/json
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/createNote',function(req, res, next) {    
    var noteId = crypto.randomBytes(2).toString('hex');    
    var note = new Note({        
        userId:req.userId, 
        noteId:noteId,
        note:"Hello world",
        noteTitle:req.body.noteTitle || "Untitle",
        type:"false"
    });
    note.save(function(err) {
        if (err){
            res.send({"message":"unable to create note","error":true});            
        }else{
            res.send({"message":"Note successfully created","error":false,"noteId":noteId});            
        }
    });
});

router.post('/changeNoteTitle',function(req, res, next) {    
    var noteId = req.body.noteId,noteTitle = req.body.noteTitle;
    Note.findOneAndUpdate(
        {noteId: noteId},
        {$set:{noteTitle:noteTitle}},
        {new: true}, function(err, doc){
            if (err){
                res.send({"message":"unable to update note title","error":true});            
            }else{
                res.send({"message":"Title update successfully","error":false});            
            }
    });
});

router.post('/saveNote',function(req, res, next) { 
    var noteId = req.body.noteId,
        userId = req.body.userId,
        noteData = req.body.note,
        noteTitle = req.body.noteTitle,
        type = req.body.type;
        // console.log(noteId,userId,noteData,type);
    Note.findOneAndUpdate(
        {noteId:noteId},
        {$set: { 
            // userId:userId,        
            // noteId:noteId,
            note:noteData,
            // noteTitle:noteTitle,
            // type:type
            }},
        {upsert: true},
        function(err,note) {                        
        if (err){            
            res.status(500).send({"message":"unable to save the note","error":true,"devInfo":"error on note save","devErr":err});
        }else{
            res.send({"error":false,"message":"Note saved successfully"});
        }
    });
});

router.get('/getNote', function(req, res, next) {
    var noteId = req.query.noteId;    
    console.log(req.userId);
    Note.find()
    .where('noteId').equals(noteId)
    .exec(function (err, note){
        if(err){
            res.status(500).send({"message":"unable to find the note","error":true,"devInfo":"error on note find","devErr":err});
        }else{            
            if(note.length == 0){                    
                res.send({"error":true,"message":"note not found"});
            }else{
                if( note[0].userId == req.userId){
                    res.send({ "error": false,"message": "note found", "noteData": note[0]});    
                }else{
                    res.send({ "error": false,"message": "Unauthorized access"});    
                }                
            }
        }
    });    
});

router.post('/publishNote', function(req, res, next) {
    var noteId = req.body.noteId; 
    // console.log(noteId,req.userId);
    Note.find({ noteId: noteId, userId: req.userId},function (err, note){
        console.log(note);
        if(err){
            // res.send({ "error": false,"message": "Unauthorized access"});    
            res.status(500).send({"message":"unable to find the note","error":true,"devInfo":"error on note find","devErr":err});
        }else{            
            if(note.length == 0){                    
                res.send({"error":true,"message":"note not found"});
            }else{
                note[0].type = true;
                note[0].save();
                res.send({ "error": false,"message": "note published"});                   
            }
        }
    });    
});

router.post('/unPublishNote', function(req, res, next) {
    var noteId = req.body.noteId; 
    // console.log(noteId,req.userId);
    Note.find({ noteId: noteId, userId: req.userId},function (err, note){
        // console.log(note);
        if(err){            
            res.status(500).send({"message":"unable to find the note","error":true,"devInfo":"error on note find","devErr":err});
        }else{            
            if(note.length == 0){                    
                res.send({"error":true,"message":"note not found"});
            }else{
                note[0].type = false;
                note[0].save();
                res.send({ "error": false,"message": "note unpublished"});                   
            }
        }
    });    
});

router.get('/getNotesList', function(req, res, next) {
    var userId = req.userId;
    console.log(userId);
    Note.find()
    .where('userId').equals(userId)
    .select('-note')
    .exec(function (err, doc){
        if(err){
            res.status(500).send({"message":"unable to find the note","error":true,"devInfo":"error on note find","devErr":err});
        }else{            
            if(doc.length == 0){                    
                res.send({"error":false,"message":"no note found","note":doc});
            }else{                
                res.send({ "error": false,"message": "note found", "note": doc });
            }
        }
    });    
});

router.get('/readNote', function(req, res, next) {
    var noteId = req.query.noteId;
    console.log(noteId);
    Note.find()
    .where('noteId').equals(noteId)    
    .exec(function (err, doc){
        if(err){
            res.status(500).send({"message":"unable to find the note","error":true,"devInfo":"error on note find","devErr":err});
        }else{            
            if(doc.length == 0){                    
                res.send({"error":true,"message":"note is not found"});
            }else{      
                console.log(doc[0]);
                if(doc[0].type == "true"){
                    res.send({ "error": false,"message": "note found", "note": doc[0].note, "noteId": doc[0].noteId });
                }else{
                    res.send({"error":true,"message":"note is not published"});    
                }
                
            }
        }
    });    
});

module.exports = router;
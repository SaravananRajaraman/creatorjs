var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var crypto = require('crypto');

// var users = require('../models/users');
// var resetPwdToken = require('../models/reset-token');
var token = require('../models/token');
var Note = require('../models/note');

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


router.post('/saveNote',function(req, res, next) {    
    var note = new Note({        
        userId:req.body.userId,        
        noteId:req.body.noteId,
        note:req.body.note,
        type:req.body.type
    });
    note.save(function(err) {
        if (err){
            res.status(500).send({
                error:"ture",
                msg:"Note save failed",
                err:err
            });
        }else{
            res.send({
                error:"false",
                msg:"Note saved successfully"
            });
        }
    });
});

router.get('/getNote', function(req, res, next) {
    var noteId = req.body.noteId    
    Note.find({ 'noteId': noteId }).select('-__v').exec(function (err, doc){
        if(err){
            res.send(err);
        }else{            
            res.send({ error: false,message: "note found", note: doc });
        }
    });
    
});

// parse application/json
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));




module.exports = router;

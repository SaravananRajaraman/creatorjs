var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var track = require('../models/Tracke');

// parse application/json
router.use(bodyParser.json());

router.use(bodyParser.urlencoded({
  extended: true
}));

//Todo: Use cross Domain in global
router.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 'Content-Type, X-Requested-With');
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.send(res);
  var eventName = req.param("eventName");
  var findQuery;
  if(eventName){
    findQuery = track.find({eventName:eventName});
  }else{
    findQuery = track.find();
  }
  findQuery
      .select('-__v -comments')
      .exec(function (err, doc){
        if(err){
          res.status(500).send({"message":"get failed","error":err});
        }else{
          console.log(doc);
          if(doc.length==0){
            res.send({"message":"Not found"});
          }else{
            res.send(doc);
          }
        }
      });
});

router.delete('/', function(req, res) {
  var id = req.body.id;
  if(!id){
    res.status(500).send({"message":"Please provide id"});
  }else{
    track.remove({ _id: id }, function(err) {
      if (err) {
        res.send('fail to delete');
      }
      else {
        res.send({"message":'deleted successfully'});
      }
    });
  }
});

router.post('/',function(req, res, next) {
  var Track = new track({
    eventName:req.body.eventName,
    userProp:req.body.userProp,
    TrackEProp:req.body.TrackEProp
  });

  Track.save(function(err) {
    if (err){
      res.status(500).send(err);
    }else{
      res.send(Track);
    }
  });
});

module.exports = router;
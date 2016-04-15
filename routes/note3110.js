var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var crypto = require('crypto');

var users = require('../models/users');
var resetPwdToken = require('../models/reset-token');
var token = require('../models/token');

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




module.exports = router;

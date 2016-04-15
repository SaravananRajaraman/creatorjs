var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var noAuthentication = require('./noAuthentication');

// Connect to MongoDB
mongoose.connect('mongodb://creatorjs:creatorcode@ds035844.mongolab.com:35844/creatorjs');

console.log(new Date());

//routes assigns
var routes = require('./routes/index');
var users = require('./routes/users');
var words = require('./routes/words');
var note3110 = require('./routes/note3110');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//middleware access all request
/*app.use(function (req, res, next) {
    console.log('Time:', Date.now());
//    console.log(req.url); console.log(req.method);
    var urls = req.method+req.url;
    console.log(urls);
    next();
    *//*if(noAuthentication.indexOf(urls) == -1){
        if(req.header('token')){
            if(req.header('token') == "12345"){
                next();
            }else{
                next();
                *//**//*res.send({
                    error: true,
                    message: "Authentication failed"
                });*//**//*
            }
        }else{
            next();
            *//**//*res.send({
                error: true,
                message: "No Authentication token"
            });*//**//*
        }
    }else{
        next();
    }*//*
});*/


app.use('/', routes);
app.use('/users', users);
app.use('/note3110',note3110);
app.use('/words', words);

//app.all(/^\/demo/, function(req, res) { res.redirect('/demo/'); });
app.use('/demo/',express.static(__dirname+'/demo'));

// error handlers
// catch 404 and forward to error handler
app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  res.status(400);
//  next(err);
    res.render('error', {message: '404: File Not Found', layout: 'other' }); //changing layout
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


http.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = http.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});


module.exports = app;

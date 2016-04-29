var config = require('./config.js');
// console.log(config);

var express = require('express'); // express server
var mongoose = require('mongoose'); //For mongoDB driver
var path = require('path'); 
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var url = require('url');

if(config.isHttps === true){    
    var keydata = fs.readFileSync(config.httpsConfig.keyPath);
    var certdata = fs.readFileSync(config.httpsConfig.certPath);
    var options = {
        key: keydata,
        cert: certdata
    };
    var https = require('https').Server(options,app);
}else{
    var http = require('http').Server(app);
}

var noAuthentication = require('./noAuthentication');

// Connect to MongoDB
mongoose.connect(config.dbConfig.dbConnection);

var Token = require('./models/Token');

console.log(new Date());

//routes assigns
var routes = require('./routes/index');
var users = require('./routes/users');
var notes = require("./routes/notes");
var track = require('./routes/tracke');


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
///*

//Todo: Use cross Domain in global
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, X-Requested-With, Authorization');
    next();
});

app.use(function (req, res, next) {
    console.log('Time:', Date.now());    
    
    var path = url.parse(req.url).pathname;
    var method = req.method;    
    var uri = method+path;     
    var Authorization = req.header('Authorization');
    var urlWildCard =  path.split('/');    
    if(urlWildCard[1] == "note" || urlWildCard[1] == "tracke" || urlWildCard[1] == "track"){
        next();      
    }else if(noAuthentication.indexOf(uri) == -1){
        if(Authorization){
            Token.find()
                .where('token').equals(Authorization)
                .select('-__v -comments')
                .exec(function (err, doc){
                if(err){
                    res.status(500).send({"message":"Fail on verify token","error":true,"devInfo":"error on token find","devErr":err});
                }else{
                    // console.log(doc);
                    if(doc.length == 0){                    
                        res.send({error:true,"message":"token not found","action":"signOut"});
                    }else{
                        if(doc[0].expire > new Date().getTime()){
                            Token.findOneAndUpdate(
                                { token: Authorization },
                                { $set: { expire : new Date().getTime()+(1000*60*60*0.5) }},
                                { upsert: false },
                                function(err, token) {
                                    if(err){
                                        res.send({"message":"fail on update token","error":true,"devInfo":"error on token find","devErr":err});
                                    }else{
                                        req.userId = doc[0].userId
                                        // console.log(doc[0]);
                                        
                                        next();
                                        // res.send({"message":"Valid token","error":false});
                                    }
                                });
                        }else{
                            res.send({"message":"token expired","error":true,"action":"signOut"});
                        }
                    }
                }
            });
        }else{           
            res.send({
                error: true,
                message: "No Authentication token"
            });
        }
    }else{
        next();
    }
    
});
//*/

app.use('/', routes);
app.use('/users', users);
app.use('/notes',notes);
app.use('/track',track);
// app.use('/words', words);

app.use('/note/',express.static(__dirname+'/apps/note'));
app.use('/tracke/',express.static(__dirname+'/apps/tracke'));

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

if(config.isHttps == true){
    https.listen(process.env.PORT || config.port, process.env.IP || config.ip, function(){
        var addr = https.address();
        console.log("Server listening at", addr.address + ":" + addr.port);
    });
}else{
    http.listen(process.env.PORT || config.port, process.env.IP || config.ip, function(){
        var addr = http.address();
        console.log("Server listening at", addr.address + ":" + addr.port);
    });
}

module.exports = app;
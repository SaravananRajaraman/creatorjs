var config = require('../config');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var CronJob = require('cron').CronJob;

var User = require('../models/User');
var ResetPwdToken = require('../models/ResetPwdToken');
var Token = require('../models/Token');
var VerifyEmail = require('../models/VerifyEmail');



/* GET Users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// parse application/json
router.use(bodyParser.json());

var cronInterval = '00 00 23 * * *';
//var cronInterval = '* * * * * *';
var killTokenJobs = new CronJob(cronInterval, function() {
        killExpireToken();
    },
    null,
    true
);
killTokenJobs.start();

function killExpireToken(){
   var currentTime = Date.now();
   Token.find()       
   .where('expire').lte(currentTime)
   .exec(function (err, docs){
       if (err){
           console.log(err);
       }else{
           if (!docs || !Array.isArray(docs) || docs.length === 0)
               console.log('no docs found');
           docs.forEach( function (doc) {
               doc.remove();
           });
       }
   });
   ResetPwdToken.find()       
   .where('expire').lte(currentTime)
   .exec(function (err, docs){
       if (err){
           console.log(err);
       }else{
           if (!docs || !Array.isArray(docs) || docs.length === 0)
               console.log('no docs found');
           docs.forEach( function (doc) {
               doc.remove();
           });
       }
   });
   
}

router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/signIn',function(req, res, next) {   
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    console.log(email,password);
    var Authorization = crypto.randomBytes(16).toString('hex');
    User.find()
        .where('email').equals(email)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"unable to find the user","error":true,"devInfo":"error on user find","devErr":err});
            }else{
                if(doc.length == 0){                    
                    res.send({error:true,"message":"email not found"});
                }else{
                    if(doc[0].isVerify){
                        if(passwordHash.verify(password, doc[0].password)){
                            var token = new Token({
                                email:email,
                                userId:doc[0].userId,
                                token:Authorization,
                                inTime : new Date().getTime(),
                                expire: new Date().getTime()+(1000*60*60*0.5)
                            });
                            token.save(function(err) {
                                if (err){
                                    res.status(500).send({"message":"Create token error","error":true,"devInfo":"error on token save","devErr":err});
                                }else{                                    
                                    res.send({"message":"login successfully","error":false,"token":Authorization});                                    
                                }
                            });
                        }else{
                            res.send({"message":"invalid password","error":true});
                        }
                    }else{
                        res.send({"message":"Email not verify","error":true});
                    }
                }
            }
        });
    // res.send("Hi");
});

router.post('/signUp',function(req, res, next) {
    var hashedPassword = passwordHash.generate(req.body.password);
    var userId = crypto.randomBytes(8).toString('hex');
    var email = req.body.email;
    var username = req.body.username;
    console.log(email,username);
    var user = new User({
        username:username,
        email:email,
        password:hashedPassword,
        userId:userId,
        isVerify: false
    });
    user.save(function(err) {
        if (err){
                res.send({"message":"already signed up","error":true,"email":email});
            // res.status(500).send({"message":"Sign up fail","error":true,"email":email,"devInfo":"error on user save","devErr":err});
        }else{
            var verifyToken = crypto.randomBytes(13).toString('hex');
            var verifyEmail = new VerifyEmail({
                email: email,                
                token: verifyToken
            });
            verifyEmail.save(function(err) {
                if (err){
                    res.status(500).send({"message":"Sign up fail","error":true,"email":email,"devInfo":"error on verifyEmail save","devErr":err});
                }else{
                    res.send({"message":"Sign up successfully","error":false,"email":email});
                    sendMail("signUp",email,verifyToken);
                }
            });
        }
    });
});

router.get('/verifyEmail',function(req, res, next) {    
    var verifyToken = req.param('token');
    console.log(verifyToken);
    VerifyEmail.find()
        .where('token').equals(verifyToken)
        .select('email')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"fail to verify emailid","error":true,"devInfo":"error on verify find","devErr":err});
            }else{
                console.log(doc);
                if(doc.length == 0){                    
                    res.send({error:true,"message":"token not found"});
                }else{
                    User.findOneAndUpdate(
                        { email: doc[0].email },
                        { $set: { isVerify: true}},
                        { upsert: false },
                        function(err, doc) {
                            if(err){
                                res.status(500).send({"message":"fail to updae user","error":true,"devInfo":"error on update user verify","devErr":err});
                            }else{
                                VerifyEmail.findOneAndRemove({token: verifyToken}, function(err){
                                    if(err){
                                        res.status(500).send({"message":"fail to remove verify emailid","error":true,"devInfo":"error on verifyEmail findOneAndRemove","devErr":err});
                                    }else{
                                        // TODO: Need to do redirection to login page
                                        //ref : http://expressjs.com/en/4x/api.html#res.location
                                        res.send({"message":"Email verify successfully","error":false});            
                                        // res.location('../');
                                    }
                                });
                            }
                        });
                }
            }
        });
});

router.post('/resendVerifyEmail',function(req, res, next) {    
    var email = req.body.email;
    console.log(email);
    User.find()
        .where('email').equals(email)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"unable to find the email","error":true,"devInfo":"error on user find","devErr":err});
            }else{
                if(doc.length == 0){                    
                    res.send({error:true,"message":"email not found in user"});
                }else{
                    if(!doc[0].isVerify){
                        VerifyEmail.find()
                        .where('email').equals(email)
                        .select('token')
                        .exec(function (err, doc){            
                            if(err){
                                res.status(500).send({"message":"fail to resend verifyEmail","error":true,"devInfo":"error on VerifyEmail find","devErr":err});
                            }else{
                                if(doc.length == 0){
                                    res.send({error:true,"message":"email not found in verifyEmail"});
                                }else{
                                    var verifyToken = doc[0].token;
                                    sendMail("signUp",email,verifyToken);
                                    console.log(verifyToken);
                                    res.send({error:false,"message":"email verification mail sent"});
                                }
                            }
                        });    
                    }else{
                        res.send({error:true,"message":"email already verifed"});
                    }                   
                }
            }
});
});

router.post('/signOut',function(req, res, next) {
    var Authorization = req.body.token;
    Token.findOneAndRemove({token: Authorization}, function(err){
        if (err){
            res.status(500).send({"message":"fail to sign out","error":true,"devInfo":"error on token find","devErr":err});
        }else{
            res.send({"message":"logout successfully","error":false});            
        }
    });
});

router.get('/verifyToken',function(req, res, next) {
    var Authorization = req.header('Authorization');    
    Token.find()
        .where('token').equals(Authorization)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"Fail on verify token","error":true,"devInfo":"error on token find","devErr":err});
            }else{
                if(doc.length == 0){                    
                    res.send({error:true,"message":"token not found"});
                }else{
                    if(doc[0].expire > new Date().getTime()){
                        Token.findOneAndUpdate(
                            { token: Authorization },
                            { $set: { expire : new Date().getTime()+(1000*60*60*0.5) }},
                            { upsert: false },
                            function(err, data) {
                                if(err){
                                    res.send({"message":"fail on update token","error":true,"devInfo":"error on token find","devErr":err});
                                }else{
                                    res.send({"message":"Valid token","error":false,"email":doc[0].email,"userId":doc[0].userId});
                                }
                            });
                    }else{
                        res.send({"message":"token expired","error":true});
                    }
                }
            }
        });
});

router.post('/restPwdToken',function(req, res, next) {
    var email = req.body.email;
    User.find()
        .where('email').equals(email)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"fail to reset password","error":true,"devInfo":"error on user find","devErr":err});
            }else{
                if(doc.length == 0){                    
                    res.send({error:true,"message":"Email not found"});
                }else{
                    var token = crypto.randomBytes(16).toString('hex');
                    console.log(email,token);
                    var resetPwdToken = new ResetPwdToken({
                        email:email,
                        token:token,
                        expire: new Date().getTime()+(1000*60*60*24*2)
                    });
                    resetPwdToken.save(function(err) {
                        if (err){
                            res.status(500).send({"message":"fail to reset password","error":true,"devInfo":"error on resetPwdToken save","devErr":err});
                        }else{
                            res.send({"message":"Reset password ","error":false, "token":token});
                            sendMail("resetPwd",email,token);
                        }
                    });
                }
            }
        });
});

router.post('/verifyRestPwdToken',function(req, res, next) {
    var restToken = req.body.token;
    console.log(restToken);
    ResetPwdToken.find()
        .where('token').equals(restToken)
        .select('-__v -comments')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"fail to verify reset password token","error":true,"devInfo":"error on resetPwdToken find","devErr":err});
            }else{
                if(doc.length == 0){
                    res.send({"error":true,"message":"token not found"});
                }else{
                    if(doc[0].expire > new Date().getTime()){
                        res.send({"message":"valid reset token","error":false});
                    }else{
                        res.send({"message":"token expire","error":true});
                    }
                }
            }
        });
});

router.post('/resetPwd',function(req, res, next) {
    console.log("here");
    var restToken = req.body.token;
    var hashedPassword = passwordHash.generate(req.body.password);
    console.log(restToken,hashedPassword);
    ResetPwdToken.find()
        .where('token').equals(restToken)
        .select('-__v -comments')
        .exec(function (err, doc){
            console.log(doc);   
            if(err){
                res.status(500).send({"message":"fail to update reset password","error":true,"devInfo":"error on resetPwdToken find","devErr":err});
            }else{
                if(doc.length == 0){
                    res.send({"error":true,"message":"Reset Pwd Token not found"});
                }else{
                    if(doc[0].expire > new Date().getTime()){
                        var email = doc[0].email;
                        User.findOneAndUpdate(
                            { email: email },
                            { $set: { password:hashedPassword }},
                            { upsert: false },
                            function(err, doc) {
                                if(err){
                                    res.send({"message":"fail to update password","error":true,"devInfo":"error on user update","devErr":err});
                                }else{
                                    ResetPwdToken.findOneAndRemove({token: restToken}, function(err){
                                        if(err){
                                            res.status(500).send({"message":"fail to remove resetPwdToken","error":true,"devInfo":"error on resetPwdToken findOneAndRemove","devErr":err});
                                        }else{
                                            // res.send({"message":"Email verify successfully","error":false});            
                                            res.send({"message":"Password reset successfully","error":false});
                                        }
                                    });                                    
                                }
                            });
                    }else{
                        res.send({"message":"Invalid token","error":true});
                    }
                }
            }
        });
});

function sendMail(type,receivers,link){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.mail.email,
            pass: config.mail.password
        }
    });
    var mailObj;
    if(type == "signUp"){
        mailObj = {
            from: config.mail.email,
            to: receivers,
            subject:'Verify email',
            html : link
        };
    }else{
        mailObj = {
            from: config.mail.email,
            to: receivers,
            subject:'Reset password link',
            html : link
        };
    }
    transporter.sendMail(mailObj, function(error, info){
        if(error){
            console.log('Incorrect email or password');
            console.log(error);
        }else{
            console.log(info);
        }
    });
}

module.exports = router;
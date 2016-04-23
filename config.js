var local = {
	"isHttps": false,
	"ip":"0.0.0.0",
    "port": "3000",
    "dbConfig": {
      "dbConnection": "mongodb://creatorjs:creatorcode@ds035844.mongolab.com:35844/creatorjs",
      "collections":{
            "user": "users",
            "token":"tokens",
            "resetPwdToken":"resetPwdTokens",
            "verifyEmail":"verifyEmails",
            "notes":"notes"
          }
    },
    "httpsConfig": {
      "keyPath": "",
      "certPath": ""
    },
    "logConfig": "/defaultAccess.log",
    "mail":{
        "email":"mail.creatorjs@gmail.com",
        "password":"Cre@t0rjs"
    },
    "appLocation":"https://heroku-saravananrajaraman.c9.io/"
    // "appLocation":"http://creatorjs.herokuapp.com/"
};

module.exports = local;
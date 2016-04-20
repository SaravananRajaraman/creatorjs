var local = {
	"isHttps": false,
	"ip":"0.0.0.0",
    "port": "3000",
    "dbConfig": {
      "dbConnection": "mongodb://devcreatorjs:devcreatorjs@ds011291.mlab.com:11291/devcreatorjs",
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
        }
};

module.exports = local;
window.TRACKE = {
    developer:true,
    config:{
        APIKey:"saravanan",
        endPoints:function(type){
            var endPoints='';
            switch (type){
                case "local":
                    endPoints = "http://localhost:3000/track";
                    break;
                case "server":
                    // endPoints = "https://node-dev.herokuapp.com/track";
                    // endPoints = "https://heroku-saravananrajaraman.c9.io/track";
                    endPoints = "https://creatorjs.herokuapp.com/track";
                    break;
                default :
                    endPoints = "http://localhost:3000/track";
            }
            return endPoints;
        }
    },
    trackMe:function(eventName,data){
        var userData = data;
        var trackName = eventName || "unknown";
        if( typeof data !== 'object'){
            userData = {
                track:data
            }
        }
        var obj = {
            eventName:trackName,
            TrackEProp : TRACKE.clientInfo(),
            userProp:userData
        };
        TRACKE.ajax(obj);
    },
    trackAs:function(data){
        return data;
    },
    clientInfo:function(){
        return{
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,
            os:TRACKE.help.getOsType(),
            browser:TRACKE.help.getBrowserType(),
            browserVersion:TRACKE.help.getBrowserVersion(),
            userAgent:window.navigator.userAgent
        }
    },
    help:{
        getOsType:function(){
            var OSName="unknown OS";
            if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
            if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
            if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
            if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
            return OSName;
        },
        getBrowserType:function(){
            var sBrowser, sUsrAg = navigator.userAgent;
            if(sUsrAg.indexOf("Chrome") > -1) {
                sBrowser = "Google Chrome";
            } else if (sUsrAg.indexOf("Safari") > -1) {
                sBrowser = "Apple Safari";
            } else if (sUsrAg.indexOf("Opera") > -1) {
                sBrowser = "Opera";
            } else if (sUsrAg.indexOf("Firefox") > -1) {
                sBrowser = "Mozilla Firefox";
            } else if (sUsrAg.indexOf("MSIE") > -1) {
                sBrowser = "Microsoft Internet Explorer";
            }
            return sBrowser;
        },
        getBrowserVersion:function(){
            var ua= navigator.userAgent, tem,
                M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if(/trident/i.test(M[1])){
                tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE '+(tem[1] || '');
            }
            if(M[1]=== 'Chrome'){
                tem= ua.match(/\bOPR\/(\d+)/);
                if(tem!= null) return 'Opera '+tem[1];
            }
            M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
            return M.join(' ');
        },
        makeParamString:function(obj){
            var encodedString = '';
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (encodedString.length > 0) {
                        encodedString += '&';
                    }
                    encodedString += encodeURI(prop + '=' + obj[prop]);
                }
            }
            return encodedString;
        }
    },
    ajax:function(data){
        var xhr = new XMLHttpRequest();
        xhr.open('POST',TRACKE.config.endPoints("server"));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
            }
        };
        xhr.send(JSON.stringify(data));
//        xhr.send(data);
    }
};
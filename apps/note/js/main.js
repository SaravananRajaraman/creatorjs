 /* global $ _ app Backbone config cookie location*/
require.config({
    paths: {
        text: 'libs/require/text'
    }
});
require(['Router'],function( Router ){
        console.log('main.js');        
                
        var app = window.app = window.app || {};
        //reset page setup calls
        
        window.cookie = { // refer in http://www.w3schools.com/js/js_cookies.asp
            getCookie: function(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            },
            setCookie: function(cname,cvalue,exdays) {            
                // console.log(config.siteDomain);
                var d = new Date();
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                // var domain =(config.siteDomain!=""?("domain=" + config.siteDomain):"");
                var expires = "expires=" + d.toGMTString();
                var path = "path=/";
                document.cookie = cname+"="+cvalue+"; "+path+"; "+expires;                
                //document.cookie = cname+"="+cvalue+"; path=/; "+domain+" "+expires;                
            },
            deleteCookies: function() {            
                cookie.setCookie('token', null, -1);
            }        
        };
        
        app.displayPage = function(currentPage){
            if(app.currentPage){
                //console.log("onFadeOut");
                try{
                    app.currentPage.onClose();
                }catch(e){
                    // onClose method is not defined on the particular view.
                    app.currentPage.undelegateEvents();
                }
                app.currentPage.$el.trigger("closePage");
                app.currentPage.$el.hide();
            }
            app.currentPage = currentPage;
            currentPage.$el.show();
        };    
        
        //ajax call settup
        app.server = 1 ; // 0 - json endpoint, 1 - real server
        app.local = "./js/json/";
        app.rootUrl = config.siteUrl;
        app.api = config.serverApi;
        app.token = cookie.getCookie("token");
        app.currentState = window.location.hash.substr(1).trim();

        app.endPoints ={
            //User Management
            signIn : [
                app.local + 'signIn.json',
                app.api + 'users/signIn'
            ],
            signUp : [
                app.local + 'signUp.json',
                app.api + 'users/signUp'
            ],
            forgetPwd : [
                app.local + 'signUp.json',
                app.api + 'users/restPwdToken'
            ],
            verifyRestPwdToken : [
                app.local + 'signUp.json',
                app.api + 'users/verifyRestPwdToken'
            ],
            resetPwd : [
                app.local + 'signUp.json',
                app.api + 'users/resetPwd'
            ],
            
            verifyAuthorization : [
                app.local + 'signUp.json',
                app.api + 'users/verifyToken'
            ],
            
            fetchNote:[
                app.local + 'signUp.json',
                app.api + 'notes/getNotesList'
            ],
            createNote:[
                app.local + 'signUp.json',
                app.api + 'notes/createNote'
            ],
            
            getNote:[
                app.local + 'signUp.json',
                app.api + 'notes/getNote'
            ],
            saveNote:[
                app.local + 'signUp.json',
                app.api + 'notes/saveNote'
            ],
        };
        if( app.currentState == 'resetpassword' ){
            mainInit();
        }
        else if( app.token ){
            $.ajax({
                url: app.endPoints.verifyAuthorization[app.server],
                type: "GET",
                dataType:'json',
                headers: { 'Authorization': app.token },
                success:function(data){
                    if( !data.error ){                                                
                        app.userId = data.userId;                                                                        
                        app.email = data.email;
                        //setting profile photos     
                        cookie.deleteCookies();
                        cookie.setCookie('token', app.token, 1);
                        mainInit();
                    }else{
                        console.log(data.message);
                        location.href = '#signIn';
                        mainInit();
                    }
                },error:function(err){
                    console.log("Error : " + err);
                    location.href = '#signIn';
                    mainInit();
                }
            });
        }else{            
            mainInit();
        }

        // mainInit();
        function mainInit(){
            new Router;            
            Backbone.history.start();             
        }
});


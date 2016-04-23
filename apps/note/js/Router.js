 /* global $ _ app Backbone*/
define([
    'views/Header',    
    'views/Home',       
    'views/Noteboard',
    'views/Noteread',    
    'views/Notes',       
    // 'views/Dashboard',       
    'views/SignIn',
    'views/SignUp',
    'views/ForgetPwd',
    'views/ResetPwd'
    ], function(HeaderView,homeView,noteboardView,notereadView,notesView,signInView,signUpView,forgetPwdView,resetPwdView){
    var header_view;
    var Router = Backbone.Router.extend({
        routes: {
            "home":"home",
            // "dashboard/:option":"dashboard",
            "note/:noteId":"note",
            "noteread/:noteId":"noteread",
            "noteboard":"noteboard",             
            "signIn":"signIn",             
            "signUp":"signUp",
            "signOut":"signOut",
            "forgetPwd":"forgetPwd",             
            "resetPwd/:token":"resetPwd",             
            "*actions" : "defaultRoute"
        },
        defaultRoute: function(){
            //if( !app.userState ){     location.href = '#login';        return;      }
            location.href = '#home';
        },
        home:function(){
            window.app.currentState = 'home';
            new homeView(); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        /*dashboard:function(option){
            new dashboardView({model:{options:option}}); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },*/
        noteread:function(noteId){
            window.app.currentState = 'noteread';
            new notereadView({model:{noteId:noteId}}); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        note:function(noteId){
            window.app.currentState = 'note';
            new notesView({model:{noteId:noteId}}); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        noteboard:function(){
            window.app.currentState = 'noteboard';
            new noteboardView();           
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        signIn:function(){ 
            window.app.currentState = 'signIn';
            new signInView(); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        signOut:function(){
            $.ajax({
              url: app.endPoints.signOut[app.server],                
              type: "post",
              headers: {'Authorization': app.token},
              data:{
                  token: app.token                  
              },        
              dataType: 'json',          
              success: function (res) {                
                if(!res.error){
                    // app={};
                    cookie.deleteCookies();      
                    location.href = '#signIn';  
                }else{              
                  alert(res.message);                  
                }            
              },
              error: function (err) {
                alert("Error on server");
                console.log(err);
              }
            });            
        },
        signUp:function(){ 
            window.app.currentState = 'signUp';
            new signUpView(); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        forgetPwd:function(){ 
            window.app.currentState = 'forgetPwd';
            new forgetPwdView(); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        resetPwd:function(token){ 
            window.app.currentState = 'resetPwd';
            new resetPwdView({model:{token:token}}); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        }
    });
    return Router;
});




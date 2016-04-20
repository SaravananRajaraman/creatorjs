 /* global $ _ app Backbone*/
define([
    'views/Header',    
    'views/Home',       
    'views/Noteboard',       
    'views/Notes',       
    // 'views/Dashboard',       
    'views/SignIn',
    'views/SignUp',
    'views/ForgetPwd',
    'views/ResetPwd'
    ], function(HeaderView,homeView,noteboardView,notesView,signInView,signUpView,forgetPwdView,resetPwdView){
    var header_view;
    var Router = Backbone.Router.extend({
        routes: {
            "home":"home",
            // "dashboard/:option":"dashboard",
            "note/:noteId":"note",
            "noteboard":"noteboard",             
            "signIn":"signIn",             
            "signUp":"signUp",             
            "forgetPwd":"forgetPwd",             
            "resetPwd/:token":"resetPwd",             
            "*actions" : "defaultRoute"
        },
        defaultRoute: function(){
            //if( !app.userState ){     location.href = '#login';        return;      }
            location.href = '#signIn';
        },
        home:function(){
            new homeView(); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        /*dashboard:function(option){
            new dashboardView({model:{options:option}}); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },*/
        note:function(noteId){
            new notesView({model:{noteId:noteId}}); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        noteboard:function(){
            new noteboardView();           
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        signIn:function(){ 
            new signInView(); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        signUp:function(){ 
            new signUpView(); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        forgetPwd:function(){ 
            new forgetPwdView(); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        },
        resetPwd:function(token){ 
            new resetPwdView({model:{token:token}}); 
            if( header_view ){   console.log('closed'); header_view.onClose();    }
            header_view = new HeaderView();
        }
    });
    return Router;
});




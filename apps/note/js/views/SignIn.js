 /* global $ _ app Backbone cookie*/
define([
  'text!templates/signIn.html'
  ], function(signInTemplate){
    var self;
  var signInView = Backbone.View.extend({
    el: $('#mainContent'),
    events: {
     "submit #signInForm" : "signIn"
    },
    initialize: function() {
      //debugger;
        self = this;
        $("#mainContent").empty().append(_.template(signInTemplate));                
        app.displayPage(this);
        self.cssIntialize();
        $(window).resize(function(){
            self.cssIntialize();
        });
    },   
    signIn:function(e){
      e.preventDefault();
      $.ajax({
          url: app.endPoints.signIn[app.server],                
          type: "post",
          data:{
              email:$("#inputEmail3").val(),
              password:$("#inputPassword3").val()
          },        
          dataType: 'json',          
          success: function (res) {            
            if(!res.error){
              cookie.setCookie('token', res.token, 1);
              app.token = res.token;
              location.href = '#noteboard';              
            }else{
              $("#inputPassword3").val("");
              radio('global:headerAlert').broadcast("error","Invalid email or password");                  
            }            
          },
          error: function (err) {
            // alert("Error on server");
            radio('global:headerAlert').broadcast("warning","something went wrong, Please try again later");                  
            console.log(err);
          }
      });
    },
    cssIntialize:function(){
        $('#mainContent').css({ height: ($(window).height()-100), overflow : 'auto'});
    },
    onClose:function(){        
        self.undelegateEvents();
    }   
  });
  return signInView;
});
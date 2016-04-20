 /* global $ _ app Backbone*/
define([
  'text!templates/resetPwd.html'
  ], function(signInTemplate){
    var self;
  var resetPwdView = Backbone.View.extend({
    el: $('#mainContent'),
    events: {
       "submit #resetPwdForm" : "resetPwd"     
    },
    initialize: function() {
      //debugger;
        self = this;        
        if(this.model.token){
          self.verifyRestPwdToken(this.model.token);
        }else{
          location.href = '#signIn';
        }
        
        $("#mainContent").empty().append(_.template(signInTemplate));                
        app.displayPage(this);
        self.cssIntialize();
        $(window).resize(function(){
            self.cssIntialize();
        });
    },    
    verifyRestPwdToken:function(token){
      $.ajax({
          url: app.endPoints.verifyRestPwdToken[app.server],                
          type: "post",
          data:{
              token:token
          },
          // headers: {'Authorization': avapp.token},
          dataType: 'json',
          // global: false,
          success: function (res) {
            console.log(res)
          },
          error: function (err) {
            console.log(err);
          }
      });      
    },
    resetPwd:function(){
      $.ajax({
          url: app.endPoints.resetPwd[app.server],                
          type: "post",
          data:{
              token: this.model.token,
              password: $("#pwd").val()
          },
          // headers: {'Authorization': avapp.token},
          dataType: 'json',
          // global: false,
          success: function (res) {
            console.log(res);
          },
          error: function (err) {
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
  return resetPwdView;
});
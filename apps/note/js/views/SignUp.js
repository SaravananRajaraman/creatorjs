 /* global $ _ app Backbone*/
define([
  'text!templates/signUp.html'
  ], function(signInTemplate){
    var self;
  var signInView = Backbone.View.extend({
    el: $('#mainContent'),
    events: {
     "submit #signUpForm" : "signUp"
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
    signUp:function(){
      $.ajax({
          url: app.endPoints.signUp[app.server],                
          type: "post",
          data:{
              username:$("#inputusername3").val(),
              email:$("#inputEmail3").val(),
              password:$("#inputPassword3").val()
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
  return signInView;
});
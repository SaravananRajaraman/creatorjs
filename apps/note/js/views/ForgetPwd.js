 /* global $ _ app Backbone*/
define([
  'text!templates/forgetPwd.html'
  ], function(signInTemplate){
    var self;
  var forgetPwdView = Backbone.View.extend({
    el: $('#mainContent'),
    events: {
     "submit #forgetPwdForm" : "forgetPwd"
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
    forgetPwd:function(){
      $.ajax({
          url: app.endPoints.forgetPwd[app.server],                
          type: "post",
          data:{
              email:$("#inputEmail3").val()              
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
    cssIntialize:function(){
        $('#mainContent').css({ height: ($(window).height()-100), overflow : 'auto'});
    },
    onClose:function(){        
        self.undelegateEvents();
    }   
  });
  return forgetPwdView;
});
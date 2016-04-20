define([
  'text!templates/home.html'
  ], function(homePageTemplate){
    var self;
  var homeView = Backbone.View.extend({
      el: $('#mainContent'),
    events: {
     
    },
    initialize: function() {
        self = this;               
        $("#mainContent").empty().append(_.template(homePageTemplate));                
        app.displayPage(this);
        self.cssIntialize();
        $(window).resize(function(){
            self.cssIntialize();
        });
    },    
    cssIntialize:function(){
        $('#mainContent').css({ height: ($(window).height()-100), overflow : 'auto'});
    },
    onClose:function(){        
        self.undelegateEvents();
    },    
  });
  return homeView;
});
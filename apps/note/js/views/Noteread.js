/* global $ _ app Backbone*/
define([
  'text!templates/noteread.html'
  ], function(notereadTemplate){
  var self;
  var notereadView = Backbone.View.extend({
    el: $('#mainContent'),
    events: {
     
    },
    initialize: function() {
        self = this;               
        $("#mainContent").empty().append(_.template(notereadTemplate));   
        app.noteId = this.model.noteId;
        app.displayPage(this);
        self.cssIntialize();
        $(window).resize(function(){
            self.cssIntialize();
        });
        // self.noteSetup();
        self.getNote();
    },   
    getNote:function(){      
      $.ajax({
        url: app.endPoints.readNote[app.server],                
        type: "get",
        data:{            
            noteId: app.noteId,
            userId: app.userId
        },
        headers: {'Authorization': app.token},
        dataType: 'json',       
        success: function (res) {
          if(res.error){
            alert("Unauthorized access");
            location.href = "#noteboard";  
          }else{
            $("#editor").html(res.noteData.note);
            var noteTitle = res.noteData.noteTitle;
            $("#notetitle").val(noteTitle);
            app.noteTitle = noteTitle;            
          }          
        },
        error: function (err) {
          alert("error"); 
        }
      });
    },    
    cssIntialize:function(){
        $('#mainContent').css({ height: ($(window).height()-100), overflow : 'auto'});
    },
    onClose:function(){        
        self.undelegateEvents();
    },    
  });
  return notereadView;
});
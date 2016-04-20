 /* global $ _ app Backbone cookie location*/
define([
  'text!templates/noteboard.html'
  ], function(noteboardTemplate){
    var self;
  var noteboardView = Backbone.View.extend({
      el: $('#mainContent'),
    events: {
        // 'click #newNote':'createNote',
        'submit #createNoteForm':'createNote'
    },
    initialize: function() {
        self = this;               
        $("#mainContent").empty().append(_.template(noteboardTemplate));                
        app.displayPage(this);
        self.cssIntialize();
        $(window).resize(function(){
            self.cssIntialize();
        });
        self.fetchNote();
    },    
    fetchNote:function(){
        console.log(app.userId);
        $.ajax({
          url: app.endPoints.fetchNote[app.server],                
          type: "get",               
          dataType: 'json',
          headers: {'Authorization': app.token},
          success: function (res) {            
            if(!res.error){
                // console.log(res);
                self.renderNotesList(res.note);
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
    renderNotesList:function(data){        
        if(!data.length){
            $("#noNote").show();            
            $("#noteList").hide();
        }else{
            $("#noNote").hide();            
            $("#noteList").show();
            for(var x =0; x<data.length; x++){
                var noteListItemClone = $(".noteListItemClone").clone().addClass("noteListItem").removeClass("noteListItemClone").show();    
                noteListItemClone.find("a").text(data[x].noteTitle).attr("href","#note/"+data[x].noteId);
                $("#noteList").append(noteListItemClone);                
            }
        }
    },
    createNote:function(){
        $('#createNoteModal').modal('hide');
        $.ajax({
          url: app.endPoints.createNote[app.server],                
          type: "post",
          headers: {'Authorization': app.token},
          data:{
              userId: app.userId,
              noteTitle: $("#noteTitle").val()
          },        
          dataType: 'json',          
          success: function (res) {                
            if(!res.error){
               location.href = '#note/'+res.noteId;              
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
    cssIntialize:function(){
        $('#mainContent').css({ height: ($(window).height()-100), overflow : 'auto'});
    },
    onClose:function(){        
        self.undelegateEvents();
    },    
  });
  return noteboardView;
});
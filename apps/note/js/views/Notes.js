/* global $ _ app Backbone*/
define([
  'text!templates/notes.html'
  ], function(notesTemplate){
    var self;
  var notesView = Backbone.View.extend({
    el: $('#mainContent'),
    events: {
      'click #saveNote':'saveNote' 
    },
    initialize: function() {
        self = this;               
        $("#mainContent").empty().append(_.template(notesTemplate));   
        app.noteId = this.model.noteId;
        self.cssIntialize();
        $(window).resize(function(){
            self.cssIntialize();
        });
        self.noteSetup();
        self.getNote();
    },   
    getNote:function(){      
      $.ajax({
        url: app.endPoints.getNote[app.server],                
        type: "get",
        data:{            
            noteId: app.noteId            
        },
        headers: {'Authorization': app.token},
        dataType: 'json',       
        success: function (res) {
          if(res.error){
            location.href = "#noteboard";  
          }else{
            $("#editor").html(res.noteData.note);
          }          
        },
        error: function (err) {
          alert("error"); 
        }
      });
    },
    saveNote:function(){
      var html = $("#editor").html();
      $.ajax({
        url: app.endPoints.saveNote[app.server],                
        type: "post",
        data:{
            note:html,
            noteId: app.noteId,
            userId: app.userId            
        },
        headers: {'Authorization': app.token},
        dataType: 'json',
        // global: false,
        success: function (res) {
          if(res.error){
            alert("unable to save note");
          }else{
            console.log("note save successfully");
          }  
        },
        error: function (err) {
          alert("error");
          console.log(err);
        }
      });
    },
    noteSetup:function(){
          function initToolbarBootstrapBindings() {
            var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 
                  'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
                  'Times New Roman', 'Verdana'],
                fontTarget = $('[title=Font]').siblings('.dropdown-menu');
                $.each(fonts, function (idx, fontName) {
                    fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
                });
                $('a[title]').tooltip({container:'body'});
    	          $('.dropdown-menu input').click(function() {return false;})
		              .change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');})
                  .keydown('esc', function () {this.value='';$(this).change();});

                $('[data-role=magic-overlay]').each(function () { 
                  var overlay = $(this), target = $(overlay.data('target')); 
                  overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
                });
                if ("onwebkitspeechchange"  in document.createElement("input")) {
                    var editorOffset = $('#editor').offset();
                    $('#voiceBtn').css('position','absolute').offset({top: editorOffset.top, left: editorOffset.left+$('#editor').innerWidth()-35});
                } else {
                    $('#voiceBtn').hide();
                }
	        };
	        function showErrorAlert (reason, detail) {
		        var msg='';
		        if (reason==='unsupported-file-type') { msg = "Unsupported format " +detail; }
		        else {
			        console.log("error uploading file", reason, detail);
		        }
		        $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>'+ 
		          '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
	        };
          initToolbarBootstrapBindings();  
    	    $('#editor').wysiwyg({ fileUploadError: showErrorAlert} );
            window.prettyPrint && prettyPrint();
          // });  
          
    },
    cssIntialize:function(){
        $('#mainContent').css({ height: ($(window).height()-100), overflow : 'auto'});
    },
    onClose:function(){        
        self.undelegateEvents();
    },    
  });
  return notesView;
});
/* global $ _ app Backbone*/
define([
  'text!templates/notes.html'
  ], function(notesTemplate){
    var self,isProgress;
  var notesView = Backbone.View.extend({
    el: $('#mainContent'),
    events: {
      'click #saveNote':'saveNote',
      'click .shareNote':"shareNote",
      'focusout #noteName input':"updateTitle"
    },
    initialize: function() {
        self = this;               
        $("#mainContent").empty().append(_.template(notesTemplate));   
        app.noteId = this.model.noteId;
        app.displayPage(this);
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
            var noteTitle = res.noteData.noteTitle;
            $("#notetitle").val(noteTitle);
            $(".readLink").attr("href","#noteread/"+app.noteId);
            app.noteTitle = noteTitle;            
            self.toggleShareNote(res.noteData.type);
          }          
        },
        error: function (err) {
          alert("error"); 
        }
      });
    },
    toggleShareNote:function(type){
      if(type){
        $(".makePrivate").show();
        $(".makePublic").hide();
      }else{
        $(".makePrivate").hide();
        $(".makePublic").show();
      }
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
            // alert("unable to save note");
            radio('global:headerAlert').broadcast("error",res.message);
          }else{
            radio('global:headerAlert').broadcast("success","Note saved successfully");
            console.log("note save successfully");
          }  
        },
        error: function (err) {
          // alert("error");
          radio('global:headerAlert').broadcast("error","Something went wrong");
          console.log(err);
        }
      });
    },
    shareNote:function(e){
      if(isProgress)return;
      isProgress = true;
      var shareType = $(e.currentTarget).attr("data-shareType");
      var url = ""
      
      if(shareType == "public"){
        self.toggleShareNote(true);  
        url = app.endPoints.unPublishNote[app.server];
      }else{
        self.toggleShareNote(false);
        url = app.endPoints.publishNote[app.server];
      }
      $.ajax({
        url:url,                 
        type: "post",
        data:{            
            noteId: app.noteId            
        },
        headers: {'Authorization': app.token},
        dataType: 'json',
        // global: false,
        success: function (res) {
          isProgress = false;
          if(res.error){
            // alert("unable to save note");
            radio('global:headerAlert').broadcast("error",res.message);
          }else{
            radio('global:headerAlert').broadcast("success","Successfully share setting updated");
            console.log("note save successfully");
          }  
        },
        error: function (err) {
          isProgress = false;
          // alert("error");
          radio('global:headerAlert').broadcast("error","something went wrong");
          console.log(err);
        }
      });      
    },
    updateTitle:function(e){
      var noteTitle = $(e.currentTarget).val();
      if(noteTitle == app.noteTitle) return;
      $.ajax({
        url: app.endPoints.updateTitle[app.server],                
        type: "post",
        data:{            
            noteId: app.noteId,
            noteTitle: noteTitle            
        },
        headers: {'Authorization': app.token},
        dataType: 'json',
        // global: false,
        success: function (res) {
          if(res.error){
            radio('global:headerAlert').broadcast("error",res.message);
          }else{
            radio('global:headerAlert').broadcast("success","Title saved successfully");
            console.log("note save successfully");
          }  
        },
        error: function (err) {
          radio('global:headerAlert').broadcast("error","Something went wrong");
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
        $("#editor").height($(window).height()-170);
    },
    onClose:function(){        
        self.undelegateEvents();
    },    
  });
  return notesView;
});
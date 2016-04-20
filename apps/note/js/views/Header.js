define([
    'text!templates/header.html',
], function(Template){
    var self;
    var EditorHeaderView = Backbone.View.extend({
        el: $('#mainHeader'),
        statsTemplate: _.template(Template),
        events: {
        
        },
        initialize: function() {            
            console.log('init EditorHeaderView');
            this.$el.html(this.statsTemplate());
            self = this;            
        },        
        onClose:function(){
            console.log("onClose");
            self.stopListening();
            self.undelegateEvents();
            $(".changePasswordWrapper").remove();
        }
    });
    return EditorHeaderView;
});

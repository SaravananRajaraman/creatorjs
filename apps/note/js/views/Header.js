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
            radio('global:headerAlert').unsubscribe(self.userAlert).subscribe(self.userAlert);
        },     
        userAlert:function(type,message){
            switch (type) {
                case 'success':
                    $(".headerAlert").finish().slideDown().removeClass("alert-success alert-danger alert-warning").addClass("alert-success").find("span").html(message).end().delay(7500).slideUp();
                    break;
                case 'error':
                    $(".headerAlert").finish().slideDown().removeClass("alert-success alert-danger alert-warning").addClass("alert-danger").find("span").html(message).end().delay(7500).slideUp();
                    break;
                case 'warning':
                    $(".headerAlert").finish().slideDown().removeClass("alert-success alert-danger alert-warning").addClass("alert-warning").find("span").html(message).end().delay(7500).slideUp();
                    break;                    
                default:
                    console.log("Something went wrong in userAlert");
            }
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

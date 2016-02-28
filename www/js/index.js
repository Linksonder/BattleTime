var app = {
   
    initialize: function() {
        this.bindEvents();
    },
  
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }, 
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        navigator.camera.getPicture( 
            function(){//On success
                alert('suc');
            }, 
            function(){ //On error
                
            });   
    }
};

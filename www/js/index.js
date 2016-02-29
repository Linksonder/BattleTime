
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
       
    },
    takePicture: function() {
    
    }
};

var battletime = angular.module('battletime', []);

battletime.controller('mainCtrl', function($scope, $http){
    
    $scope.selectedBboy = {};
    $scope.test = ' hello world';
    $scope.bboys = [];
    $scope.isLoading = true;
    $scope.imageURI = null;
    
    $scope.parse = function(){
         $scope.selectedBboy  = angular.fromJson($scope.selectedBboy);
        
    }
    
    $http.get('http://www.rawneal.nl/battletime/bboy/getall').then( function(result){
         $scope.bboys =  angular.fromJson(result.data);
           $scope.isLoading = false;
    });
    
    $scope.timestamp = new Date();
    
    $scope.saveBboy = function(){
        
        $scope.isLoading = true;

        var options = new FileUploadOptions();
        options.fileKey="userFile";
        options.chunkedMode = false;
        options.fileName=$scope.imageURI.substr($scope.imageURI.lastIndexOf('/')+1);

        var url = "http://www.rawneal.nl/battletime/bboy/UpdatePicture/" + $scope.selectedBboyId;
        
          function onSuccess(result){
            alert('success');
              $scope.timestamp = new Date();
              $scope.isLoading = false;
              $scope.$apply();
        };
        
        function onError(error) {
              $scope.isLoading = false;
              $scope.$apply();
              alert('error.code' + error.code);
              alert('error.source' + error.source);
              alert('error.target' + error.target);
        };
 
        var ft = new FileTransfer();
        ft.upload($scope.imageURI, url, onSuccess, onError, options); 
    }
    
    $scope.takePicture = function(){
         navigator.camera.getPicture(function(imageURI){
             $scope.imageURI = imageURI;
             $scope.$apply();
         }, function(err){  }, 
         { 
              quality: 50, 
              destinationType: navigator.camera.DestinationType.FILE_URI,
              sourceType: navigator.camera.PictureSourceType.CAMERA 
          });
    }
     
      
      
     
});

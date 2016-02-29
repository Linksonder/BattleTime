
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
        options.fileName= 'uploaded.png';
        options.mimeType="text/plain";

        var params = new Object();
        options.params = params;
        
        var url = "https://www.rawneal.nl/battletime/bboy/UpdatePicture/" + $scope.selectedBboyId;
        
        
        var ft = new FileTransfer();
        ft.upload($scope.imageURI, url, onSuccess, onError); 

        function onSuccess(result){
              $scope.timestamp = new Date();
              $scope.isLoading = false;
              $scope.$apply();
        };
        
        function onError(error) {
              $scope.isLoading = false;
        };
    }
    
    $scope.takePicture = function(){
         navigator.camera.getPicture(function(imageURI){
             $scope.imageURI = imageURI;
         }, function(err){  }, 
         { 
              quality: 50, 
              destinationType: navigator.camera.DestinationType.FILE_URI,
              sourceType: navigator.camera.PictureSourceType.CAMERA 
          });
    }
     
      
      
     
});

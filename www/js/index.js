
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

var battletime = angular.module('battletime', ['ui.select']);

battletime.controller('mainCtrl', function($scope, $http){
    
    $scope.entity = {
      selected: null
    };
    
    $scope.test = ' hello world';
    $scope.entities = [];
    $scope.isLoading = true;
    $scope.imageURI = null;
    
    
    $http.get('http://www.rawneal.nl/battletime/api/getall').then( function(result){
         $scope.entities =  result.data;
         $scope.isLoading = false;
    });
    
    $scope.selectChange = function(){
        $scope.isLoading = true;
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        document.body.appendChild(field);

        setTimeout(function() {
            field.focus();
            setTimeout(function() {
                field.setAttribute('style', 'display:none;');
            }, 50);
        }, 50);
    }
    
    $scope.timestamp = new Date();
    
    $scope.saveBboy = function(){
        
        $scope.isLoading = true;

        var options = new FileUploadOptions();
        options.fileKey="userFile";
        options.chunkedMode = false;
        options.fileName=$scope.imageURI.substr($scope.imageURI.lastIndexOf('/')+1);

        var url = "http://www.rawneal.nl/battletime/api/UpdatePicture/" + $scope.entity.selected._id;
        
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


battletime.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope.isLoading = false;
                scope.$apply();
            });
        }
    };
});
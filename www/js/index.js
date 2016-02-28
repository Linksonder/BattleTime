
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
        var path = $scope.mediaFile.fullPath;
        var name =  $scope.mediaFile.name;
        
        var options = new FileUploadOptions();
        options.fileKey="userFile";
        options.fileName= $scope.mediaFile.name;
        options.mimeType="image/jpeg";

        var params = new Object();
        params.fullpath = path;
        params.name = name;

        options.params = params;
        options.chunkedMode = false;
        
       
        
        var ft = new FileTransfer();
        ft.upload( path, "http://www.rawneal.nl/battletime/bboy/UpdatePicture/" + $scope.selectedBboyId,
            function(result) {
                $scope.timestamp = new Date();
                $scope.isLoading = false;
                $scope.$apply();
            },
            function(error) {
               $scope.isLoading = false;
            },
            options
            );
    }
    
    $scope.takePicture = function(){
         navigator.device.capture.captureImage(function(mediaFiles){
             $scope.mediaFile = mediaFiles[0];
         }, function(err){  }, { limit: 1 });
    }
     
      
      
     
});

var battletime = angular.module('battletime', ['ui.select']);

battletime.controller('mainCtrl', function($scope, $http){
    
    $scope.page = 'start';
    
    $scope.contestent = {};
    $scope.timestamp = new Date();
    
    $scope.test = ' hello world';
    $scope.entities = [];
    $scope.isLoading = true;
    
    $http.get('http://www.rawneal.nl/battletime/api/getall').then( function(result){
         $scope.entities = result.data;
         $scope.isLoading = false;
    });
    
    $scope.isInvalid = function(){
        return $scope.contestent.name == null || $scope.contestent.type == null
    }
    
    $scope.addEntity = function(){
        
        if($scope.isInvalid())
            return;
            
        $scope.isLoading = true;
            
        $http({
            url: 'http://www.rawneal.nl/battletime/api/AddEntity',
            data:  $scope.contestent,
            method: 'POST',
            headers: {'ContentnewEntity-Type': 'application/x-www-form-urlencoded'}   
        }).then(function(newEntity){
            $scope.contestent = newEntity.data;
            $scope.savePhoto(function(){
                $http.get('http://www.rawneal.nl/battletime/api/getall').then( function(entities){
                        $scope.entities = entities.data;
                        $scope.page = 'start';
                        $scope.isLoading = false;
                        $scope.search = "";
                        $scope.$apply();
                });
            });
        });
    }
    
    
    
    $scope.select = function(entity){
        $scope.contestent = entity;
        $scope.page = 'details';
    }
    
    $scope.toggle = function(page){
        if($scope.page == "add" || $scope.page == "details"){
            page = "start";
            $scope.search = "";
        }
            
        if(page == "add"){
            $scope.contestent = {
                name: $scope.search
            }
        }
        
         $scope.page = page;
         
        
    }
    
    $scope.getEntityImage = function(){
        if($scope.imageURI)
             return $scope.imageURI;
        if($scope.contestent.img_url)
            return "http://www.rawneal.nl/battletime/" + $scope.contestent.img_url + "?" +  $scope.timestamp;
        
        return "img/default.png"
    }
    
    
    $scope.savePhoto = function(cb){
        
        $scope.isLoading = true;
        
        if(!$scope.imageURI){
            return cb();
        }

        var options = new FileUploadOptions();
        options.fileKey="userFile";
        options.chunkedMode = false;
        options.fileName=$scope.imageURI.substr($scope.imageURI.lastIndexOf('/')+1);
        
        var url = "http://www.rawneal.nl/battletime/api/UpdatePicture/" + $scope.contestent._id;
        function onSuccess(result){
              alert("Saved!");
              $scope.imageURI = null;
              $scope.timestamp = new Date();
              $scope.isLoading = false;
              $scope.$apply();
              if(cb){cb();}
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
var battletime = angular.module('battletime', ['ui.select']);

battletime.controller('mainCtrl', function($scope, $http){
    
    $scope.page = 'start';
    
    $scope.contestent = {};
    $scope.selectedBattle = null;
    $scope.timestamp = new Date();
    
    $scope.entities = [];
    $scope.isLoading = true;
    $scope.showBattle = false;
    $scope.tab = 'a';
    
    document.addEventListener("backbutton", function(e){
        $scope.page = 'start';
        $scope.showBattle = false;
        $scope.opponent = null;
        $scope.selectedBattle = null;
        $scope.$apply();
    });
    
    $scope.selectBattle = function(index, battle){
        $scope.selectedBattle = battle;
        $scope.selectBattle.index = index;
    }
    
    $scope.startBattle = function(){
        $scope.isLoading = true;
         $http.get('http://www.rawneal.nl/battletime/api/StartBattle/' + $scope.selectedBattle._id).then( function(result){
            $scope.battles = result.data;
            $scope.isLoading = false;
        });
    }
    
    $scope.winBattle = function(winnerId){
        $scope.isLoading = true;
         $http.post('http://www.rawneal.nl/battletime/api/WinBattle/' + $scope.selectedBattle._id, {winner: winnerId}).then( function(result){
            $scope.battles = result.data;
            $scope.isLoading = false;
        });
    }
    
    $scope.deleteBattle = function(){
         $scope.battles.splice($scope.selectedBattle.index, 1);
         $http.get('http://www.rawneal.nl/battletime/api/DeleteBattle/' + $scope.selectedBattle._id).then( function(result){
            $scope.battles = result.data;
        });;
        $scope.selectedBattle = undefined;
    }
    
    $scope.loadEntities = function(){
        $scope.isLoading = true;
        $http.get('http://www.rawneal.nl/battletime/api/getall').then( function(result){
            $scope.entities = result.data;
            $scope.isLoading = false;
        });
    }
    
    $scope.loadBattles = function(){
        $scope.isLoading = true;
        $http.get('http://www.rawneal.nl/battletime/api/getallBattles').then( function(result){
            $scope.battles = result.data;
            $scope.isLoading = false;
        });
    }
    

    $scope.isInvalid = function(){
        return $scope.contestent.name == null || $scope.contestent.type == null
    }
    
    $scope.addBattle = function(playerOneId, playerTwoId, battleType){        
        $http({
            url: 'http://www.rawneal.nl/battletime/api/AddBattle',
            data:  {
                team_a: playerOneId, 
                team_b: playerTwoId,
                type: battleType == "bboy" ? "1on1" : "2on2"
            },
            method: 'POST',
          
        }).then(function(newEntity){
            if($scope.page == 'details'){
                $http.get('http://www.rawneal.nl/battletime/api/GetEntity/' + playerOneId).then( function(result){
                    $scope.contestent = result.data;
                    alert("Battle saved");
                    $scope.showBattle = false;
                    $scope.loadBattles();
                    
                });     
            }
            else{
                $scope.page = "start";
                $scope.loadBattles();
                
            }
                
           
        });
    }
    
     $scope.saveEntity = function(){
         $scope.isLoading = true;
            
        $http({
            url: 'http://www.rawneal.nl/battletime/api/EditEntity',
            data:  $scope.contestent,
            method: 'POST',
            headers: {'ContentnewEntity-Type': 'application/x-www-form-urlencoded'}   
        }).then(function(newEntity){
            $scope.contestent = newEntity.data;
            $scope.savePhoto(function(){
                $scope.page = 'start';
                $scope.search = "";
                $scope.loadEntities();
            });
        });
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
                $scope.page = 'start';
                $scope.search = "";
                $scope.loadEntities();
            });
        });
    }
    
    $scope.hasChanged = function(){
        return $scope.contestent == contestent;
    }
    
    $scope.select = function(entity){
        $scope.contestent = entity;
        $scope.isLoading = true;
        $http.get('http://www.rawneal.nl/battletime/api/GetEntity/' + entity._id).then( function(result){
            $scope.contestent = result.data;
            $('<img />')
                .attr('src', "http://www.rawneal.nl/battletime/" + $scope.contestent.img_url)
                .error(function(){
                      $scope.isLoading = false;
                      $scope.page = 'details';
                      $scope.$apply(); 
                })
                .load(function(){
                      $scope.isLoading = false;
                      $scope.page = 'details';
                      $scope.$apply(); 
                });
        }, onError);     
    }
    
    $scope.toggle = function(page){
        if($scope.page == "add" || $scope.page == "details"){
            page = "start";
            $scope.search = "";
        }
        if(page == "add"){$scope.contestent = {name: $scope.search}}
        $scope.page = page;
        $scope.battleType = 'duo';
        $scope.opponent = null;
        $scope.showBattle = false;
    }
    
    $scope.getEntityImage = function(){
        if($scope.imageURI)
             return $scope.imageURI;
        if($scope.contestent.img_url)
            return "http://www.rawneal.nl/battletime/" + $scope.contestent.img_url + "?" +  $scope.timestamp;
        
        return "img/default.png"
    }
    
    $scope.takeAndSavePicture = function(){
        $scope.takePicture(function(){
            $scope.savePhoto(function(){
               $http.get('http://www.rawneal.nl/battletime/api/GetEntity/' + entity._id).then( function(result){
                    $scope.contestent = result.data;
                    $scope.isLoading = false;
                    $scope.page = 'details';
                    $scope.$apply();
                });     
            });
        });
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
              alert("Saved");
              $scope.imageURI = null;
              $scope.timestamp = new Date();
              $scope.loadEntities();
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
    
    $scope.takePicture = function(cb){
         navigator.camera.getPicture(function(imageURI){
             $scope.imageURI = imageURI;
             
             if(cb){
                 cb();
             }
             else{
                 $scope.$apply();
             }
         }, function(err){  }, 
         { 
              quality: 50, 
              destinationType: navigator.camera.DestinationType.FILE_URI,
              sourceType: navigator.camera.PictureSourceType.CAMERA 
          });
    }
    
    $scope.pullToRefresh = function(){
       return new Promise( function( resolve, reject ) {
            $http.get('http://www.rawneal.nl/battletime/api/getall').then( function(result){
                $scope.entities = result.data;
                $http.get('http://www.rawneal.nl/battletime/api/getallBattles').then( function(result){
                    $scope.battles = result.data;
                     resolve();
                });
            });          
        });  
    }
    
    function onError(){
        alert('Oops! :(');
        $scope.isLoading = false;
    }
    
    //init
    $scope.loadEntities();  
    $scope.loadBattles(); 
    WebPullToRefresh.init( {loadingFunction: $scope.pullToRefresh });

     
});
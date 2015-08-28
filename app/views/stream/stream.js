'use strict';

var streamController = angular.module('controllers.stream', []);

streamController.controller('StreamCtrl', ["$scope", "UploadFactory", function($scope, UploadFactory) {
    
    $scope.uploadedVideos = [];
    $scope.videoplaying = false;
    
    var successGetList = function(list) {
        for( var i in list ) {
            $scope.uploadedVideos.push({ "name":list[i] });
        }
        $scope.$apply();
//        console.log("Retrieved list " + $scope.uploadedVideos);
    }
    
    var errorGetList = function(err) {
        console.log("Error in streamCtrl " + err);
    }
    
    UploadFactory.getnewvideoslist(successGetList, errorGetList);
    
    $scope.closeVideoBox = function(element) {
        $scope.videoplaying = false;
        var el  = angular.element($('#videomgmt'))[0];
        
        if(el)
            el.src = "";        
    }
    
    $scope.playvideo = function(videoElement) {
//        console.log(JSON.stringify(videoElement));
        
        var name = videoElement.name;
        video.requestUnpublished(name);
//        video.request(name);
        $scope.videoplaying = true;
    }
    
    $scope.approvevideo = function(videoElement) {
//        console.log(JSON.stringify(videoElement));
        
        var name = videoElement.name;
        video.requestUnpublished(name);
//        video.request(name);
        $scope.videoplaying = true;
    }
    
    $scope.deletevideo = function(videoElement) {
    
        console.log("Delete " + JSON.stringify(videoElement));
        var name = videoElement.name;
        
        UploadFactory.deleteunpublished(
            name,
            function(data){
                console.log("DELETE OK: " + JSON.stringify(data));
            },
            function(err){
                console.log("DELETE ERR: " + err);
            });
    }
}]);
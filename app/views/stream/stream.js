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
        console.log("Retrieved list " + $scope.uploadedVideos);
    }
    
    var errorGetList = function(err) {
        console.log("Error in streamCtrl " + err);
    }
    
    UploadFactory.getnewvideoslist(successGetList, errorGetList);
    
    
    $scope.playvideo = function(videoElement) {
        console.log(JSON.stringify(videoElement));
        
        var name = videoElement.name;
        video.requestUnpublished(name);
//        video.request(name);
        $scope.videoplaying = true;
    }
    
    $scope.closeVideoBox = function() {
        $scope.videoplaying = false;
    }
    
    $scope.deletevideo = function(videoElement) {
    
        console.log(JSON.stringify(videoElement));
    }
}]);
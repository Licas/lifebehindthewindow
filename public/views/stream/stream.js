'use strict';

var streamController = angular.module('controllers.stream', []);

streamController.controller('StreamCtrl', ["$scope", "UploadFactory", "$timeout", function($scope, UploadFactory, $timeout) {
    
    $scope.uploadedVideos = [];
    $scope.publishedVideos = [];
    $scope.videoplaying = false;
    $scope.view=false;
    $scope.download=false;
    
    
    UploadFactory.getnewvideoslist(
        function(list) {
            $scope.uploadedVideos = list;
            $scope.$apply();
        }, 
        function(err) {
            console.log("Error in streamCtrl " + err);
        });
    
    UploadFactory.getlist(
        function(list) {
            $scope.publishedVideos = list;
            $scope.$apply();
        }, 
        function(err) {
            console.log("Error in streamCtrl " + err);
        });
    
    $scope.closeVideoBox = function(element) {
        $scope.videoplaying = false;
        
        var el  = angular.element($('#videomgmt'))[0];
        
        if(el)
            el.src = "";        
    }
    
    $scope.playvideo = function(videoElement) {
        var id = videoElement.id;
        
        $scope.videoplaying = true;
        $scope.view=true;
        
        video.requestUnpublished(id);
    }
    
    $scope.playpubvideo = function(videoElement) {
        var id = videoElement.id;
    
        $scope.view=true;
        $scope.videoplaying = true;
        
        video.request(id);
    }
    
    $scope.downloadpubvideo = function(videoElement) {
        var id = videoElement.id;
        
        $scope.download = true;
        
        video.request(id);
    }
    
    $scope.approvevideo = function(videoId, idx) {
        
        function succ(data) {
            var elem = $scope.uploadedVideos[idx];
            console.log(JSON.stringify(elem));
            $scope.publishedVideos.push(elem);
            $scope.uploadedVideos.splice(idx, 1);
        }
        
        function error(err) {
            console.log("APPROVE ERR: " + err);
        }
        console.log("approving");
        UploadFactory.approveunpublished(videoId, succ, error)
    }
    
    $scope.deletevideo = function(videoId, idx) {
        
        function succ(data) {
            $scope.uploadedVideos.splice(idx, 1);
        }
        
        function error(err) {
            console.log("DELETE ERR: " + err);
        }
        
        UploadFactory.deleteunpublished(videoId, succ, error);
    }
    
    $scope.deletepubvideo = function(videoId, idx) {    
        
        function succ(data) {
            $scope.publishedVideos.splice(idx, 1);
        }
        
        function error(err) {
            console.log("DELETE ERR: " + err);
        }
        
        UploadFactory.deletepublished(videoId, succ, error);
    }
}]);
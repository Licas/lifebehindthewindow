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

        video.requestUnpublished(id);
        $scope.videoplaying = true;
    }
    
    $scope.playpubvideo = function(videoElement) {
        var id = videoElement.id;
        
        video.request(id);
        $scope.view=true;
        $scope.videoplaying = true;
    }
    
    $scope.downloadpubvideo = function(videoElement) {
        var id = videoElement.id;
        $scope.download=true;
        video.request(id);
    }
    
    $scope.approvevideo = function(videoElement) {
        var id = videoElement.id;

        function succ(data) {
            console.log("APPROVE OK: " + JSON.stringify(data));
//            $timeout(function() { $scope.done = true; },2000);
            for ( var i in $scope.uploadedVideos ) {
                if( $scope.uploadedVideos[i].id === id ) {
                    delete $scope.uploadedVideos[i];
                    break;
                }
            }
        }
        
        function error(err) {
            console.log("APPROVE ERR: " + err);
        }
        
        UploadFactory.approveunpublished(id, succ, error)
    }
    
    $scope.deletevideo = function(videoElement) {
    
        console.log("Delete " + JSON.stringify(videoElement));
        var id = videoElement.id;
        
        function succ(data) {
            console.log("DELETE OK: " + JSON.stringify(data));
            for ( var i in $scope.uploadedVideos ) {
                if( $scope.uploadedVideos[i].id === id ) {
                    delete $scope.uploadedVideos[i];
                    break;
                }
            }
        }
        
        function error(err) {
            console.log("DELETE ERR: " + err);
        }
        
        UploadFactory.deleteunpublished(id, succ, error);
    }
    
    $scope.deletepubvideo = function(videoElement) {    
        console.log("Delete " + JSON.stringify(videoElement));
        var id = videoElement.id;
        
        function succ(data) {
            console.log("DELETE OK: " + JSON.stringify(data));
            
            for ( var i in $scope.publishedVideos ) {
                if( $scope.publishedVideos[i].id === id ) {
                    delete $scope.publishedVideos[i];
                    break;
                }
            }
        }
        
        function error(err) {
            console.log("DELETE ERR: " + err);
        }
        
        UploadFactory.deletepublished(id, succ, error);
    }
}]);
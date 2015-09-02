'use strict';

var streamController = angular.module('controllers.stream', []);

streamController.controller('StreamCtrl', ["$scope", "UploadFactory", "$timeout", function($scope, UploadFactory, $timeout) {
    
    $scope.uploadedVideos = [];
    $scope.publishedVideos = [];
    $scope.videoplaying = false;
    
    var successGetList = function(list) {
        for( var i in list ) {
            $scope.uploadedVideos.push({ "name":list[i] });
        }
        $scope.$apply();
    }
    
    var errorGetList = function(err) {
        console.log("Error in streamCtrl " + err);
    }
    
    var successGetPubList = function(list) {
        for( var i in list ) {
            $scope.publishedVideos.push({ "name":list[i] });
        }
        $scope.$apply();
    }
    
    var errorGetPubList = function(err) {
        console.log("Error in streamCtrl " + err);
    }
    
    UploadFactory.getnewvideoslist(successGetList, errorGetList);
    UploadFactory.getlist(successGetPubList, errorGetPubList);
    
    $scope.closeVideoBox = function(element) {
        $scope.videoplaying = false;
        var el  = angular.element($('#videomgmt'))[0];
        
        if(el)
            el.src = "";        
    }
    
    $scope.playvideo = function(videoElement) {
        var name = videoElement.name;

        video.requestUnpublished(name);
        $scope.videoplaying = true;
    }
    
    $scope.playpubvideo = function(videoElement) {
        var name = videoElement.name;
        
        video.request(name);
        $scope.videoplaying = true;
    }
    
    $scope.downloadpubvideo = function(videoElement) {
//        var name = videoElement.name;
//        video.request(name);
//        $scope.videoplaying = true;
    }
    
    $scope.approvevideo = function(videoElement) {
        var name = videoElement.name;

        function succ(data) {
            console.log("APPROVE OK: " + JSON.stringify(data));
//            $timeout(function() { $scope.done = true; },2000);
            for ( var i in $scope.uploadedVideos ) {
                if( $scope.uploadedVideos[i].name === name ) {
                    delete $scope.uploadedVideos[i];
                    break;
                }
            }
        }
        
        function error(err) {
            console.log("APPROVE ERR: " + err);
        }
        
        UploadFactory.approveunpublished(name, succ, error)
    }
    
    $scope.deletevideo = function(videoElement) {
    
        console.log("Delete " + JSON.stringify(videoElement));
        var name = videoElement.name;
        function succ(data) {
            console.log("DELETE OK: " + JSON.stringify(data));
            for ( var i in $scope.uploadedVideos ) {
                if( $scope.uploadedVideos[i].name === name ) {
                    delete $scope.uploadedVideos[i];
                    break;
                }
            }
        }
        
        function error(err) {
            console.log("DELETE ERR: " + err);
        }
        
        UploadFactory.deleteunpublished(name, succ, error);
    }
    
    $scope.deletepubvideo = function(videoElement) {    
        console.log("Delete " + JSON.stringify(videoElement));
        var name = videoElement.name;
        
        function succ(data) {
            console.log("DELETE OK: " + JSON.stringify(data));
            
            for ( var i in $scope.publishedVideos ) {
                if( $scope.publishedVideos[i].name === name ) {
                    delete $scope.publishedVideos[i];
                    break;
                }
            }
        }
        
        function error(err) {
            console.log("DELETE ERR: " + err);
        }
        
        UploadFactory.deletepublished(name, succ, error);
    }
}]);
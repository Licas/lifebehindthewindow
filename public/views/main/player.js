'use strict';

var playerController = angular.module('controllers.player', []);

playerController.controller('HomeCtrl', ["$scope", "$sce", "$timeout", "$interval", "UploadFactory", function ($scope, $sce, $timeout, $interval, UploadFactory) {

        var controller = this;

        controller.playerReady = false;
        controller.loading = false;
        controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;
        controller.videos = [];
        var videos = [];
        var currentVideo = -1;
        var state = 'ready';

        
        $scope.startPlayLoop = function() {
            currentVideo = -1;
            state = 'ready';

            getVideoList();

            $timeout(loadNextVideo,1000);
            $interval(getVideoList, 10000);
//            $interval(loadNextVideo, 5000);
        }

        $scope.onComplete = function() {
            state = 'ready';
            loadNextVideo();
        }
        $scope.loadNextVideo = loadNextVideo;

        function loadNextVideo() {
            if(state == 'ready' && videos.length > 0) {
                currentVideo = currentVideo + 1;

//                console.log("load next video: " + currentVideo);
//                console.log("video length : "  + videos.length);
                if (currentVideo >= videos.length)
                    currentVideo = 0;

                 if(videos[currentVideo]) {
//                    console.log("requesting " + JSON.stringify(videos[currentVideo]));
                    videoUtilities.request(videos[currentVideo].id);
                    state = 'starting';
                }
            }
        }

        function getVideoList() {
//            console.log("getlist");
            UploadFactory.getlist(
                function( msg ) { // success
                    videos = [];
                    
                    for(var idx in msg) {
//                        console.log("Pushing " + JSON.stringify(msg[idx]));
                        videos.push(msg[idx]);
                    }
                    if(state == 'ready') {
                        loadNextVideo();
                    }
                },
                function( msg ) { // error
                    console.log('!!! error in get video list ' + msg);
                });
        }
    
}]);

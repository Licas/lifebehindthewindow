'use strict';

var playerController = angular.module('controllers.player', []);

playerController.controller('HomeCtrl', ["$scope", "$sce", "$timeout", "$interval", "UploadFactory", function ($scope, $sce, $timeout, $interval, UploadFactory) {

        var controller = this;

//        controller.config = {
//            responsive: true,
//            stretch: 'fit',
//            loop: false,
//            autoHide: false,
//            autoHideTime: 3000,
//            autoPlay: true,
//            preload: "auto",
//            sources: null,
//            theme: {
//                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
//            },
//            plugins: { }
//        };
    
        controller.playerReady = false;
        controller.loading = false;
        controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;
        controller.videos = [];
        var videos = [];
        var currentVideo = -1;
        var state = 'ready';
    
//        controller.onPlayerReady = function (API) {
//            controller.API = API;
//            controller.API.setVolume(0);
//            controller.playerReady = true;
//
//            $interval(getVideoList, 3000);
//            $interval(loadVideo,5000);
//        }
    
//        controller.changeSource = function () {
//            this.config.sources = this.media[1].sources;
//            this.config.tracks = undefined;
//            this.config.loop = false;
//            this.config.preload = true;
//        }
        
//        controller.onCompleteVideo = function () {
////            console.log("Called onCompletedVideo");
//            controller.API.stop();
//            controller.API.isCompleted = true;
//            controller.isCompleted = true;
//            controller.currentState = 'stop';
//            controller.currentVideo++;
//
//            if (controller.currentVideo >= controller.videos.length)
//                controller.currentVideo = 0;
//
//            controller.setVideo(controller.currentVideo);
//        }
//
//        controller.setVolume = function (volume) {
//            controller.API.setVolume(volume);
//        }
//
//        controller.setVideo = function (index) {
//            if(controller.videos[index]) {
////                console.log("Request a new video: " + JSON.stringify(controller.videos[index]));
//                controller.API.stop();
//                video.request(controller.videos[index].id);
//                controller.currentVideo = index;
//                $timeout(controller.API.play.bind(controller.API), 2000);
//            }
//        }

        
        $scope.startPlayLoop = function() {
//            console.log("startPlayLoop");
            currentVideo = -1;
            state = 'ready';

            getVideoList();
            $timeout(loadNextVideo,3000);
            $interval(getVideoList, 60000);
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

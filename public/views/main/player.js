'use strict';

var playerController = angular.module('controllers.player', []);

playerController.controller('HomeCtrl', ["$scope", "$sce", "$timeout", "$interval", "UploadFactory", function ($scope, $sce, $timeout, $interval, UploadFactory) {

        var controller = this;
                                          
        controller.config = {
            responsive: true,
            stretch: 'fit',
            loop: false,
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: true,
            preload: "auto",
//            sources: controller.videos.length>0? controller.videos[0].sources: null,
            sources: null,
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            },
            plugins: { }
        };
    
        controller.playerReady = false;
        controller.loading = false;
        controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;
        controller.videos = [];
        
    
        controller.onPlayerReady = function (API) {
            controller.API = API;
            controller.API.setVolume(0);
            controller.playerReady = true;
            console.log("get video list and load video");
            $interval(getVideoList, 3000);
            $interval(loadVideo,5000);
        }
    
        
        controller.changeSource = function () {
            this.config.sources = this.media[1].sources;
            this.config.tracks = undefined;
            this.config.loop = false;
            this.config.preload = true;
        }
        
        controller.onCompleteVideo = function () {
//            console.log("Called onCompletedVideo");
            controller.API.stop();
            controller.API.isCompleted = true;
            controller.isCompleted = true;
            controller.currentState = 'stop';
            controller.currentVideo++;

            if (controller.currentVideo >= controller.videos.length) 
                controller.currentVideo = 0;
           
            controller.setVideo(controller.currentVideo);
        }
        
//        controller.videos = [
//            { sources: [{src: $sce.trustAsResourceUrl("/assets/videos/LegoHulkBuster.mp4"),
//                        type: "video/mp4"}] },
//            { sources: [{src: $sce.trustAsResourceUrl("/assets/videos/AustralianWolverine.mp4"),
//                        type: "video/mp4" }] }];
                     
        controller.setVolume = function (volume) {
            controller.API.setVolume(volume);
        }
        
        controller.setVideo = function (index) {
            if(controller.videos[index]) {
    //            console.log("Request a new video: " + controller.videos[index]);
                controller.API.stop();
                video.request(controller.videos[index]);
    //             var newSource = [{
    //                    src: $sce.trustAsResourceUrl(controller.videos[index]),
    //                    type: "video/mp4"
    //                }];
                controller.currentVideo = index;
                $timeout(controller.API.play.bind(controller.API), 2000);
            }
        }
        
        function loadVideo() {
            if(!controller.loading) {
                controller.loading = true;
                controller.onCompleteVideo();
            }
        }
    
    
        function getVideoList() {
            UploadFactory.getlist(
                function( msg ) { // success
                    controller.videos = [];
                    
                    for(var idx in msg) {
//                        console.log("Pushing " + msg[idx]);
                        controller.videos.push(msg[idx]);
                    }                    
                },
                function( msg ) { // error
                    console.log('!!! error in get video list ' + msg);
                });
        }
    
}]);

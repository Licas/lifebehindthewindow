'use strict';

var playerController = angular.module('controllers.player', []);

playerController.controller('HomeCtrl', ["$scope", "$sce", "$timeout", "$interval", "UploadFactory", function ($scope, $sce, $timeout, $interval, UploadFactory) {

        var controller = this;
        var videoList = [];
                                          
        var getVideoList = function() {
            
            UploadFactory.getlist(
                function( msg ) { // success
                    console.log("Player controller reloaded list " + msg);
                    controller.videos = [];
                    
                    for(var idx in msg) {
                        console.log("Pushing " + msg[idx]);
                        controller.videos.push(msg[idx]);
                        videoList.push(msg[idx]);
                    }                    
                },
                function( msg ) { // error
                    console.log('!!! error in get video list ' + msg);
                });
        }
        
        var startPlay = function() {
            console.log("Start Play");
            while(true) {
                for(var indx in videoList) {
                    video.request(controller.videos[indx]);
                    
                    controller.API.setState('play');
                    console.log(controller.API.currentState);
                    controller.setVideo(indx);
                    
                    while(!controller.API.currentState == 'stop');
                }
            }
        }
        
        
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
            plugins: {
                //poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        };
    
        controller.loading = false;
        controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;
        controller.videos = [];
               
        controller.changeSource = function () {
            this.config.sources = this.media[1].sources;
            this.config.tracks = undefined;
            this.config.loop = false;
            this.config.preload = true;
        };
                     
        controller.onPlayerReady = function (API) {
            controller.API = API;
            controller.API.setVolume(0);
        };
       
        controller.onCompleteVideo = function () {
            console.log("ON COMPLETE VIDEO");
            controller.API.isCompleted = true;
            controller.API.stop();
            controller.isCompleted = true;
            controller.loading = true;
            controller.currentState = 'stop';
            controller.currentVideo++;

            if (controller.currentVideo >= controller.videos.length) 
                controller.currentVideo = 0;
           
            controller.setVideo(controller.currentVideo);
        };
        
        getVideoList();
//        $timeout(checkPlaying, 5000);
//        $interval(checkPlaying, 1000);
        $interval(getVideoList, 10000);
               
        
        function checkPlaying() {
            console.log("CHECK PLAYING: isCompleted=" +controller.API.isCompleted +", currentState:"+controller.API.currentState);
            if( controller.API.currentState == 'stop' ) {
                        controller.onCompleteVideo();
            }
        }
        
//        controller.videos = [
//            { sources: [{
//                        src: $sce.trustAsResourceUrl("/assets/videos/LegoHulkBuster.mp4"),
//                        type: "video/mp4"}]   },
//            { sources: [{
//                        src: $sce.trustAsResourceUrl("/assets/videos/AustralianWolverine.mp4"),
//                        type: "video/mp4" }]  }];
                     
        controller.setVolume = function (volume) {
            controller.API.setVolume(volume);
        }
        
        $scope.loadVideo = function() {
            console.log("completed video");
            controller.onCompleteVideo();
        }
        
        controller.setVideo = function (index) {
            console.log("Request a new video: " + controller.videos[index]);
            video.request(controller.videos[index]);
            
             var newSource = [{
                    src: $sce.trustAsResourceUrl(controller.videos[index]),
                    type: "video/mp4"
                }];
            
//            controller.API.stop();
            controller.currentVideo = index;
//            controller.API.changeSource(newSource);
//            controller.config.sources = newSource;
            $timeout(controller.API.play.bind(controller.API), 1000);
//            controller.API.play();
//            
            
            console.log(controller.API);
            
//
//            controller.currentVideo = index;
//            if(controller.videos.length>index)
//                controller.config.sources = [{
//                    src: $sce.trustAsResourceUrl(controller.videos[index]),
//                    type: "video/mp4"
//                }];
//            else
//                controller.config.sources = null;
//            
//            $timeout(controller.API.play.bind(controller.API), 1000);
//
//            controller.API.play();
        };
     }]);

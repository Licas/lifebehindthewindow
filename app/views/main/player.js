'use strict';

var playerController = angular.module('controllers.player', []);

playerController.controller('HomeCtrl', ["$scope", "$sce", "$timeout", "$interval", "UploadFactory",
                 function ($scope, $sce, $timeout, $interval, UploadFactory) {

        var videoList = [];
                     
        var getVideoList = function() {
            
            UploadFactory.getlist(
                function( msg ) { // success
                    console.log("PLayer controller reloaded list " + msg);
                    controller.videos = [];
                    for(var idx in msg) {
                        
//                        var aVideo = {
//                            sources: [{
//                                src:  $sce.trustAsResourceUrl( "/" + msg.published_videos[idx].name ),
//                                type: "video/mp4"
//                            }]        
//                        };
                        console.log("Pushing " + msg[idx]);
                        controller.videos.push(msg[idx]);
                        videoList.push(msg[idx]);
                    }
                    
//                    controller.config.sources = controller.videos[0].sources;
//                    console.log("controller.videos - "+controller.videos);
//                    console.log("controller.videos[0] - "+controller.videos[0].sources);
//                    console.log("controller.config.sources - " + controller.config.sources);
//                    console.log(controller.API);
                   if(controller.API.currentState == 'stop')
                        controller.onCompleteVideo();
                },
                function( msg ) { // error
                    console.log('!!! error in get video list ' + msg);
                    
                });
        }
        
        var controller = this;
        controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;
        controller.videos = [];
        controller.onPlayerReady = function (API) {
            controller.API = API;
            controller.API.setVolume(0);
        };

        controller.onError = function() {
            console.log("video error");
            controller.isCompleted = true;
            controller.currentVideo++;

            if (controller.currentVideo >= controller.videos.length) 
                controller.currentVideo = 0;
           
            controller.setVideo(controller.currentVideo);
        }
        
        controller.onCompleteVideo = function () {
//            console.log("ON COMPLETE VIDEO");
            controller.isCompleted = true;
            controller.currentVideo++;

            if (controller.currentVideo >= controller.videos.length) 
                controller.currentVideo = 0;
           
            controller.setVideo(controller.currentVideo);
        };
        
        getVideoList();
        //$interval(getVideoList, 10000);
        
//        controller.videos = [
//            {
//                sources: [{
//                        src: $sce.trustAsResourceUrl("/assets/videos/LegoHulkBuster.mp4"),
//                        type: "video/mp4"
//                    }]
//            },
//            {
//                sources: [{
//                        src: $sce.trustAsResourceUrl("/assets/videos/AustralianWolverine.mp4"),
//                        type: "video/mp4"
//                    }]
//            },
//            { sources: [{
//                        src: $sce.trustAsResourceUrl("/assets/videos/MinecraftIn20Seconds.mp4"),
//                        type: "video/mp4"
//                    }]
//            }
//        ];
        if(!controller.videos) {
            controller.videos = [{ sources: []}];
        }
                     
        controller.config = {
            responsive: true,
                stretch: 'fit',
            loop: false,
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: true,
            preload: "auto",
            sources: controller.videos.length>0? controller.videos[0].sources: null,
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            },
            plugins: {
                //poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        };

        controller.setVolume = function (volume) {
            controller.API.setVolume(volume)
        }

        controller.setVideo = function (index) {
            console.log("Request a new video: " + controller.videos[index]);
            video.request(controller.videos[index]);
            controller.API.stop();
//
            controller.currentVideo = index;
//            if(controller.videos.length>index)
//                controller.config.sources = controller.videos[index].sources;
//            else
//                controller.config.sources = null;
//            
            $timeout(controller.API.play.bind(controller.API), 1000);
//            
            controller.API.play();
        };
     }]);
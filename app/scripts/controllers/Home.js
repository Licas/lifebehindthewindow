'use strict';

angular.module('lifebehindthewindowApp')
    .controller('HomeCtrl', ["$scope", "$sce", "$timeout", function ($scope, $sce, $timeout) {

        var controller = this;
        controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;

        controller.onPlayerReady = function (API) {
            controller.API = API;

            controller.API.setVolume(0);
        };

        controller.onCompleteVideo = function () {
            controller.isCompleted = true;
            //console.log("["+controller.videos.length+"] Current video is number " + controller.currentVideo);
            controller.currentVideo++;

            if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;
            //console.log("["+controller.videos.length+"] New video is number " + controller.currentVideo);

            controller.setVideo(controller.currentVideo);

        };

        controller.videos = [
            {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl("/assets/videos/LegoHulkBuster.mp4"),
                        type: "video/mp4"
                    }
                ]
            },
            {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl("/assets/videos/AustralianWolverine.mp4"),
                        type: "video/mp4"
                    }
                ]
            },
            {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl("/assets/videos/MinecraftIn20Seconds.mp4"),
                        type: "video/mp4"
                    }
                ]
            }
        ];

        controller.config = {
            loop: false,
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: true,
            preload: "auto",
            sources: controller.videos[0].sources,
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            },
            plugins: {
                poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        };

        controller.setVolume = function (volume) {
            controller.API.setVolume(volume)
        }

        controller.setVideo = function (index) {

            controller.API.stop();

            controller.currentVideo = index;
            controller.config.sources = controller.videos[index].sources;
            $timeout(controller.API.play.bind(controller.API), 1000);
            
            controller.API.play();
        };
     }]);
'use strict';

var app = angular.module('lifebehindthewindowApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    
    'config',
    'controllers.player',
    'controllers.uploadform',
    'controllers.stream',
    
    'com.2fdevs.videogular',
	'com.2fdevs.videogular.plugins.controls',
	'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/', {
             templateUrl: 'views/main/main.html',
            controller: 'HomeCtrl'
        })
        .when('/stream', {
            templateUrl: 'views/stream/stream.html',
            controller: 'StreamCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
  }]);
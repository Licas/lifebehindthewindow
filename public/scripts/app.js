'use strict';

var app = angular.module('lifebehindthewindowApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    
    'config',
    'controllers.player',
    'controllers.login',
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
        .when('/cookie-policy', {
            templateUrl: 'views/main/cookie-policy.html',
        })
        .when('/login', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/logout', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
  }]);

app.run(['$rootScope', '$location', '$cookies', function($rootScope, $location, $cookies) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookies.get('globals') || {};
    
    if ($rootScope.globals.currentUser) {
        var authdata = $rootScope.globals.currentUser.authdata;
        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
    }
 
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $location.path() != '/' && ($.inArray($location.path(), ["/login", "/stream"]) !== -1);
        var loggedIn = $rootScope.globals.currentUser;
        
        if(!loggedIn) {
            $rootScope.isloggedin = false;
        }
        
        if (restrictedPage && !$rootScope.isloggedin) {
            $location.path('/login');
        }
    });
}]);
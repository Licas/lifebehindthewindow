'use strict';

angular.module('lifebehindthewindowApp')
  .factory('AuthenticationService', [
    '$http', '$rootScope', '$cookies', 'ENV', 'Base64Service', 
    function ( $http, $rootScope, $cookies, ENV, Base64Service) {
      
        var host = ENV.backendEndpoint;
        var port = ENV.backendPort;

        var baseUrl = 'http://' + host +':' + port;

        return {
            SetLogged: function(logged) {
                $cookies.put('loggedin', logged);
            },
            IsLogged: function() {
                return $cookies.get('loggedin');
            },

            Login: function(username, password, succCb, errorCb) {
                if(username && password) {
                    
                    $http.defaults.headers.common.Authorization = "Basic " + Base64Service.encode(username + ":" + password);

                    $http.get( baseUrl + '/api/authenticate') 
//                              , { username: username, password: password })
                        .success(function (response) {
                            succCb(response);
                        })
                        .error(function(error) {
                            errorCb(error);   
                        });
                } else {
                    errorCb("Username/Password must be provided.");
                }
            },

            Logout: function() {
                this.ClearCredentials();
            },

            SetCredentials: function(username, password) {
                var authdata = Base64Service.encode(username + ':' + password);
                console.log("encoding: " + authdata);
                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        authdata: authdata
                    }
                };

                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                $cookies.put('globals', $rootScope.globals);
                this.SetLogged(true);
            },

            ClearCredentials: function() {
                $rootScope.globals = {};
                $cookies.remove('globals');
                this.SetLogged(false);
                $http.defaults.headers.common.Authorization = 'Basic ';
            }
        };
}]);



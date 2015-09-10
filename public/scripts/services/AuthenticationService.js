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
                var d = new Date();
                d.setDate(d.getDate() + 1);
                
                $cookies.put('loggedin', logged, {
                    expires: d
                });
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
                var glob = {
                    currentUser: {
                        username: username,
                        authdata: authdata
                    }
                };
                $rootScope.globals = glob;
                $rootScope.isloggedin = this.IsLogged();
                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                
                var d = new Date();
                d.setDate(d.getDate() + 1);
                
                $cookies.putObject('globals', glob, {
                    expires: d
                });
                
                this.SetLogged(true);
            },

            ClearCredentials: function() {
                
                $cookies.remove('globals');
                $cookies.remove('loggedin');
                delete $http.defaults.headers.common['Authorization'];
                
                
                $rootScope.globals = {};
                $rootScope.isloggedin = this.IsLogged();
            }
        };
}]);



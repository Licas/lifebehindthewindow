'use strict';

var loginController = angular.module('controllers.login', []);

loginController.controller('LoginCtrl', 
    ['$scope', '$location', 'AuthenticationService', 
     function ($scope, $location, AuthenticationService) {

         this.dataLoading = false;
         
         (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
         
        $scope.login = function() {
            var username = $scope.username;
            var password = $scope.password;
            
            if(!username) {
                $scope.loginError = true;
                $scope.loginSuccess = false;
                $scope.errmsg = 'Username is required.';
            }
            else if(!password) {
                $scope.loginError = true;
                $scope.loginSuccess = false;
                $scope.errmsg = 'Password is required.';
            }
            else {
                AuthenticationService.Login(
                    username, password, 
                    function (response) {
                        if (response.success) {
                            AuthenticationService.SetCredentials( username, password);
                            $location.path('/');
                        } else {
                            $scope.loginError = true;
                            $scope.loginSuccess = false;
                            $scope.errmsg = 'User cannot be authenticated.';                            
                        }
                    },
                    function(error) {
                        console.log("Error occurred in login: "+error);
                        $scope.loginError = true;
                        $scope.loginSuccess = false;
                        $scope.errmsg = error;
                    });
            }
        };
         
        $scope.clearLogin = function() {
            $scope.username = '';
            $scope.password = '';
        }
         
}]);

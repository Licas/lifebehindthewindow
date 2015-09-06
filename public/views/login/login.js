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
         
        function login() {
            this.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
         
        $scope.clearLogin = function() {
            $scope.username = '';
            $scope.password = '';
        }
         
}]);

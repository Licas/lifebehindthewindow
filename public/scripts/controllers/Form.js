'use strict';

angular.module('lifebehindthewindowApp')
  .controller('FormCtrl', [
	'$scope',
    'UploadFactory',
    function ($scope, UploadFactory) {
      
            $scope.uploadSuccess = false;
            $scope.uploadFailure = false;
            $scope.model = {};
            $scope.selectedFile = [];

            $scope.uploadedFile = function(element) {
             $scope.$apply(function($scope) {
                 $scope.files = element.files;         
                 UploadFactory.uploadfile($scope.files[0],
                       function( msg ) // success
                       {
                        console.log('uploaded the file');
                        $scope.uploadSuccess = true;
                        $scope.uploadFailure = false;
                       },
                       function( msg ) // error
                       {
                        console.log('error');
                        $scope.uploadSuccess = false;
                        $scope.uploadFailure = true;
                       });
                });
            }
        }]
  );

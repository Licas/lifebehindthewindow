'use strict';

var formController = angular.module('controllers.uploadform', []);

formController.controller('FormCtrl', [
	'$scope',
    'UploadFactory',
    function ($scope, UploadFactory) {
      
            $scope.uploadSuccess = false;
            $scope.uploadFailure = false;

            $scope.fileNameChanged = function(element) {
                $scope.selectedFile = element;
                $scope.selectedFileName = $scope.selectedFile.files[0].name;
                console.log($scope.selectedFile.files[0].name);
            }
            
            $scope.uploadedFile = function() {
                if($scope.selectedFile.files && $scope.selectedFile.files.length >= 1) {
                    var file2upload = $scope.selectedFile.files[0];
                    
                    UploadFactory.uploadfile(
                        { 
                            file: file2upload,
                            username: $scope.user_name, 
                            userlocation: $scope.user_location
                        },
                       function( msg ) // success
                       {
                           $scope.uploadSuccess = true;
                           $scope.uploadError = false;
                           $scope.succmsg = "Your video has been uploaded!";
                       },
                       function( msg ) // error
                       {
                            $scope.uploadSuccess = false;
                            $scope.uploadError = true;
                            $scope.errmsg = "An error occurred, please try again.";
                    });
                }                
            }
        }]
  );

'use strict';

var formController = angular.module('controllers.uploadform', []);

formController.controller('FormCtrl', [
	'$scope',
    'UploadFactory',
    function ($scope, UploadFactory) {
      
            $scope.uploadSuccess = false;
            $scope.uploadFailure = false;
//            $scope.model = {};
//            $scope.selectedFile = [];

        $scope.fileNameChanged = function(element) {
            $scope.selectedFile = element;
            $scope.selectedFileName = $scope.selectedFile.files[0].name;
            console.log($scope.selectedFile.files[0].name);
        }
            $scope.uploadedFile = function() {
                if($scope.selectedFile.files && $scope.selectedFile.files.length >= 1) {
                    var file2upload = $scope.selectedFile.files[0];
                    // console.log(file2upload);
                    UploadFactory.uploadfile(
                        { 
                            file: file2upload,
                            username: $scope.user_name, 
                            userlocation: $scope.user_location
                        },
                       function( msg ) // success
                       {
//                            console.log('uploaded the file');
                            $scope.uploadSuccess = true;
                            $scope.uploadFailure = false;
                           $scope.succmsg = "Your video has been uploaded!";
                       },
                       function( msg ) // error
                       {
                            console.log('error:' + msg);
                            $scope.uploadSuccess = false;
                            $scope.uploadFailure = true;
                            $scope.errmsg = "An error occurred, please try again.";
                    });
                }                
            }
        }]
  );

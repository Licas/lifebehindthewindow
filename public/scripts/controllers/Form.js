'use strict';

angular.module('lifebehindthewindowApp')
  .controller('FormCtrl', [
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
                 console.log("User name " + $scope.user_name);
                 console.log("User location " + $scope.user_location);
                 
                if($scope.selectedFile.files && $scope.selectedFile.files.length >= 1) {
                    var file2upload = $scope.selectedFile.files[0];
                    
                    console.log(file2upload);

                    UploadFactory.uploadfile(file2upload,
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
                }                
            }
        }]
  );

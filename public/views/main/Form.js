'use strict';

var formController = angular.module('controllers.uploadform', []);

formController.controller('FormCtrl', [
	'$scope',
    'UploadFactory',
    function ($scope, UploadFactory) {
      
        $scope.uploadSuccess = false;
        $scope.uploadFailure = false;
        
        clearForm();
        
        
        function clearForm() {
            $scope.user_name = '';
            $scope.user_location = '';
            $scope.selectedFileName = '';
            $scope.selectedFile = null;
        }
        
        $scope.clearForm = clearForm;
        
        $scope.fileNameChanged = function(element) {
            $scope.selectedFile = element;
            $scope.selectedFileName = $scope.selectedFile.files[0].name;
            console.log($scope.selectedFile.files[0].name);
        }
      
        $scope.uploadedFile = function() {
            if($scope.selectedFile.files && $scope.selectedFile.files.length >= 1) {
                var file2upload = $scope.selectedFile.files[0];

                var tx = 0;
                var msg = "";
                var username     = $scope.user_name;
                var userlocation =  $scope.user_location;
                
                videoUtilities.upload(
                    {
                        file:file2upload,
                        username: username,
                        userlocation: userlocation 
                    },
                    function (err, data) {
                
                        if (data.end) {
                            msg = "Upload complete!";
                        } else if (data.rx) {
                            msg = Math.round(tx += data.rx * 100) + '% complete';
                        } else {
                            // assume error
                            msg = data.err;                   
                        }

                        $('#progress').text(msg);

                        if (data.end) {
                            console.log(msg);
                            setTimeout(function () {
                                $('#progress').fadeOut(function () {
                                    $('#progress').text('');
                                }).fadeIn();
                            }, 5000);
                        }
                });
//                UploadFactory.uploadfile(
//                    { 
//                        file: file2upload,
//                        username: $scope.user_name, 
//                        userlocation: $scope.user_location
//                    },
//                   function( msg ) // success
//                   {
//                       $scope.uploadSuccess = true;
//                       $scope.uploadError = false;
//                       $scope.succmsg = "Your video has been uploaded!";
//                       clearForm();
//                   },
//                   function( msg ) // error
//                   {
//                        $scope.uploadSuccess = false;
//                        $scope.uploadError = true;
//                        $scope.errmsg = "An error occurred, please try again.";
//                       clearForm();
//                });
            }                
        }
        }]
  );

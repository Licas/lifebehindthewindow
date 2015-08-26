'use strict';

angular.module('lifebehindthewindowApp')
  .factory('UploadFactory', [ "$http", function ( $http) {
    

    // Public API here
    return {
		uploadfile: function (file, success, error) {
		        console.log("in factory... sending file");
		        var url = 'http://localhost:3000/api/upload';

		        var fd = new FormData();
		        fd.append("file", file);

		        $http.post(url, fd, {

		                withCredentials: false,
		                headers: {'Content-Type': undefined},
		                transformRequest: angular.identity

		            })
		            .success(function (data) {
                    console.log("success in posting data");
		                console.log(data);
                        success();
		            })
		            .error(function (data) {
                    console.log("error in posting data");
		                console.log(data);
                        error();
		            });
		    }
    };
  }]);

'use strict';

angular.module('lifebehindthewindowApp')
  .factory('UploadFactory', [ "$http", function ( $http) {
    
      var baseUrl = 'http://localhost:3000';

    // Public API here
    return {
		uploadfile: function (file, success, error) {
		        console.log("in factory... sending file");
		        var url = baseUrl + '/api/upload';

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
		    },
        getlist: function(success, error) {
            console.log("in factory... get file list");
		        var url = baseUrl + '/videos/list';
                
                $http.get(url)
                    .success(function (res) {
                        console.log("Got response: " + res);
                        success(res);
                    }).error(function (e) {
                        console.log("Got error: " + e);
                        error(e);
                    });
        }
        
    };
  }]);

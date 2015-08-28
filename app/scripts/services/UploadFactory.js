'use strict';

angular.module('lifebehindthewindowApp')
  .factory('UploadFactory', [ "$http", function ( $http) {
    
      var host = 'localhost';
      var port = 3000;
      var baseUrl = 'http://' + host +':' + port;

    // Public API here
    return {
		uploadfile: function (file, success, error) {
		        var url = baseUrl + '/api/upload';

		        var fd = new FormData();
		        fd.append("file", file);

		        $http.post(url, fd, {
		                withCredentials: false,
		                headers: {'Content-Type': undefined},
		                transformRequest: angular.identity
		            })
		            .success(function (data) {
//                        console.log("success in posting data");
		                console.log(data);
                        success();
		            })
		            .error(function (data) {
//                        console.log("error in posting data");
		                console.log(data);
                        error();
		            });
		    },
        getlist: function(success, error) {
            var videoList ;
            
            video.list(function setupList(err, files) {
            
               if(err) {
                   error(err);
               } else {
                   success(files);
               }
            });
        },
        getnewvideoslist: function(success, error) {
            var videoList ;
            
            video.listUnpublished(function setupList(err, files) {
            
               if(err) {
                   error(err);
               } else {
                   success(files);
               }
            });
        }
        
    };
  }]);

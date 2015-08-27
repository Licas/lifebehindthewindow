'use strict';

angular.module('lifebehindthewindowApp')
  .factory('UploadFactory', [ "$http", function ( $http) {
    
      var host = 'localhost';
      var port = 3000;
      var baseUrl = 'http://' + host +':' + port;

    // Public API here
    return {
		uploadfile: function (file, success, error) {
//		        console.log("in factory... sending file");
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
//            console.log("in factory... get file list");
            var videoList ;
            
            video.list(function setupList(err, files) {
            
               if(err) {
                   error(err);
               } else {
                   success(files);
               }
//                files.forEach(function (file) {
//                    console.log("file found " + file);
//                    $a.attr('href', '#').text(file).click(function (e) {
//                        fizzle(e);
//
//                        var name = $(this).text();
//                        video.request(name);
//                    });
//                });
            });
//		        var url = baseUrl + '/videos/list';
//                
//                $http.get(url)
//                    .success(function (res) {
//                        console.log("Got response: " + res);
//                        success(res);
//                    }).error(function (e) {
//                        console.log("UploadFactory::getlist:: Got error: " + e);
//                        error(e);
//                    });
        }
        
    };
  }]);

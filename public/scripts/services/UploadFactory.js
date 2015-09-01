'use strict';

angular.module('lifebehindthewindowApp')
  .factory('UploadFactory', [ "$http", function ( $http) {
    
      var devhost = 'localhost';
      var host = 'lifebehindthewindow.com';
      var devport = 3000;//dev
      var port = 80;//production
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
        },
        
        deleteunpublished: function(name, success, error) {
             var url = baseUrl + '/videos/delete/unpublished';
            $http.get(url, { "params":{"videoname": name }})
                .success(function(response) {
                    console.log("Ok delete operation for video "  + name);
                    success(response);
                })
                .error(function(err){
                    console.log("Error in deleting " + err);
                    error(err);
                });
        },
        
        approveunpublished: function(name, success, error) {
             var url = baseUrl + '/videos/approve/unpublished';
            $http.get(url, { "params":{"videoname": name }})
                .success(function(response) {
                    console.log("Ok approve operation for video "  + name);
                    success(response);
                })
                .error(function(err){
                    console.log("Error in approving " + err);
                    error(err);
                });
        }
        
    };
  }]);

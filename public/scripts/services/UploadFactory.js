'use strict';

angular.module('lifebehindthewindowApp')
  .factory('UploadFactory', [ "$http", function ( $http) {
    
      var devhost = 'localhost';
      var host = 'www.lifebehindthewindow.com';
      var devport = 3000;//dev
      var port = 8080;//production
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
		                console.log("success uploading data." + data);
                        success();
		            })
		            .error(function (data) {
//                        console.log("error in posting data");
		                console.log("error uploading data." + data);
                        error();
		            });
		    },
        getlist: function(success, error) {
            var videoList ;
            
            video.list(function setupList(err, files) {
            
               if(err) {
                   console.log("Error getlist " + err);
                   error(err);
               } else {
                   console.log("Success getlist " + files);
                   success(files);
               }
            });
        },
        getnewvideoslist: function(success, error) {
            var videoList ;
            
            video.listUnpublished(function setupList(err, files) {
            
               if(err) {
                   console.log("Error listUnpublished " + err);
                   error(err);
               } else {
                   console.log("Success listUnpublished " + files);
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

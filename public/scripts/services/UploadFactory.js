'use strict';

angular.module('lifebehindthewindowApp')
  .factory('UploadFactory', [ "$http", "ENV", function ( $http, ENV) {
      
      var host = ENV.backendEndpoint;
      var port = ENV.backendPort;
    
      var baseUrl = 'http://' + host +':' + port;

    // Public API here
    return {
        //NO STREAMING
//		uploadfile: function (fileData, success, error) {
//		        var url = baseUrl + '/api/upload';
//
//		        var fd = new FormData();
//		        fd.append("file", fileData.file);
//		        fd.append("username", fileData.username);
//		        fd.append("userlocation", fileData.userlocation);
//               
//                $http.post(url, fd, {
//		                withCredentials: false,
//		                headers: {'Content-Type': undefined},
//		                transformRequest: angular.identity
//		            })
//		            .success(function (data) {
//                        success(data);
//		            })
//		            .error(function (err) {
//                        error(err);
//		            });
//		    },
        
        //WITHOUT STREAMING
        uploadfile: function (fileData, success, error) {
//            
//            video.upload(fileData.file, function (err, data) {
//                var msg;
//
//                if (data.end) {
//                    msg = "Upload complete: " + file.name;
//                } else if (data.rx) {
//                    msg = Math.round(tx += data.rx * 100) + '% complete';
//                } else {
//                    // assume error
//                    msg = data.err;                   
//                }
//                
//                 console.log(msg);
//                
//                $progress.text(msg);
//
//                if (data.end) {
//                    console.log(msg);
//                    setTimeout(function () {
//                        $progress.fadeOut(function () {
//                            $progress.text('Drop file here');
//                        }).fadeIn();
//                    }, 5000);
//                }
//            });
            var url = baseUrl + '/api/upload';

            var fd = new FormData();
            fd.append("file", fileData.file);
            fd.append("username", fileData.username);
            fd.append("userlocation", fileData.userlocation);

            $http.post(url, fd, {
                    withCredentials: false,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                })
                .success(function (data) {
                    success(data);
                })
                .error(function (err) {
                    error(err);
                });
		    },
        getlist: function(success, error) {
            video.list(function callService(err, files) {
                if(err) 
                    return error(err);
                
                var list = [];
                
                for(var i in files) {
                    list.push(JSON.parse(files[i]));
                }
                
                return success(list);
            });
        },
        getnewvideoslist: function(success, error) {
            video.listUnpublished(function callService(err, files) {
                if(err) {
                    return error(err);
                } else {
                    var list = [];

                    for(var i in files)
                        list.push(JSON.parse(files[i]));

                    return success(list);
                }
            });
        },
        
        approveunpublished: function(id, success, error) {
            var url = baseUrl + '/videos/approve/unpublished';
            
            $http.get( url, { "params": { "id": id }})
                .success(function(response) {
                    success(response);
                })
                .error(function(err){
                    error(err);
                });
        },
        
        deletepublished: function(id, success, error) {
            var url = baseUrl + '/videos/delete/published';
            
            $http.get(url, { "params": { "id": id }})
                .success(function(response) {
                    success(response);
                })
                .error(function(err){
                    error(err);
                });
        },
        
        deleteunpublished: function(id, success, error) {
            var url = baseUrl + '/videos/delete/unpublished';
            
            $http.get(url, { "params": { "id": id }})
                .success(function(response) {
                    success(response);
                })
                .error(function(err){
                    error(err);
                });
        }
    };
}]);



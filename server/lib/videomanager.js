'use strict';

var uploadPath,
    publishedVideosPath, 
    supportedTypes,
    supportedExtensions;

var config = require('./config');
var fs = require('fs');
var path = require('path');
var appDir = "";
var uploadFolder = config.uploadFolderName;
var videosFolder = config.videosFolderName;
var videodb = require(__dirname + "/../controller/videodb");

var mongoose = require('mongoose')
var VideoModel = mongoose.model('Video');

if(config.storageprefix) {
    appDir = config.storageprefix;
} else {
    appDir = path.dirname(require.main.filename);
}

publishedVideosPath = appDir +  "/" + videosFolder;
uploadPath          = appDir + "/" + uploadFolder;

console.log("#videomanager# vid path : " +publishedVideosPath);
console.log("#videomanager# up path : " +uploadPath);

supportedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg'
];
supportedExtensions = [
    'mp4', 'webm', 'ogg'
];


_checkUploadDir();

function _checkUploadDir(cb) {
    cb = cb || function () {};
    fs.stat(uploadPath, function (err, stats) {
        if (
            (err && err.errno === 34) ||
            !stats.isDirectory()
           ) {
            // if there's no error, it means it's not a directory - remove it
            if (!err) {
                console.log("_checkUploadDir:no error, not a directory");
                fs.unlinkSync(uploadPath);
            }

            // create directory
            fs.mkdir(uploadPath, cb);
            return;
        }

        cb();
    });
}

String.prototype.endsWith = function(suffix) {
    return this.match(suffix+"$") == suffix;
};

/**
 * Lists published videos 
 */
function list(stream, meta)  {
    
    videodb.videoList(
        true , 
        function(listOfVid) {
            var newList = [];
            var currEl = {};
            
            for( var i in listOfVid ) {
                currEl.id           = listOfVid[i]._id;
                currEl.title        = listOfVid[i].title;
                currEl.username     = listOfVid[i].username;
                currEl.userlocation = listOfVid[i].userlocation;
                currEl.extension    = listOfVid[i].extension;
                
                newList.push(JSON.stringify(currEl));
            }
            
            stream.write({ files: newList });
        }, 
        function(err) {
            stream.emit('error', err);
        });
}

function listUnpublished(stream, meta)  {

    videodb.videoList(
        false , 
        function(listOfVid) {
            var newList = [];
            var currEl = {};
            
            for( var i in listOfVid ) {
                currEl.id           = listOfVid[i]._id;
                currEl.title        = listOfVid[i].title;
                currEl.username     = listOfVid[i].username;
                currEl.userlocation = listOfVid[i].userlocation;
                currEl.extension    = listOfVid[i].extension;
                
                newList.push(JSON.stringify(currEl));
            }
            
            stream.write({ files: newList });
            
        }, 
        function(err) {
            stream.emit('error', err);
        });
}

/**
* Get a video published
*/
function request(client, meta) {
    //IMPREOVEMENT : CHECK EXTENSION/ STREAM FILE
    if(meta && meta.id) {
        var file = fs.createReadStream(
                        publishedVideosPath + '/' + meta.id + '.mp4',
                        { flags: 'r', autoClose: true });
        file.on('error', function(err) {
            console.log("Error in request: " + err);
            client.send(null);
        });
        client.send(file);
    }
}

/**
* Get a video not yet published
*/
function requestUnpublished(client, meta) {
    //IMPREOVEMENT : CHECK EXTENSION/ STREAM FILE
    if(meta && meta.id) {
        var file = fs.createReadStream(
                        uploadPath + '/' + meta.id + '.mp4',
                        { flags: 'r', autoClose: true });
        file.on('error', function(err) {
            console.log("Error in request: " + err);
            client.send(null);
        });

        
        if(file) {
            client.send(file);
        } else {
            client.send(null);
        }
    }
}

/**
 */
//function upload(stream, meta) {
//    console.log("UPLOADING IN SERVER");
//    if (!~supportedTypes.indexOf(meta.type)) {
//        stream.write({ err: 'Unsupported type: ' + meta.type });
//        stream.end();
//        return;
//    }
//
//    var videoModel = {
//        "title": meta.name,
//        "username": "",
//        "userlocation": ""
//    };
//    
//    console.log(JSON.stringify(meta));
//    
//    videodb.createVid(
//        videoModel,
//        
//        function(res) {
//            var objectID = res;
//            
//            var file = fs.createWriteStream(uploadPath + '/' + objectID + ".mp4");
//            stream.pipe(file);
//
//            stream.on('data', function (data) {
//                stream.write({ rx : data.length / meta.size });
//            });
//
//            stream.on('end', function () {
//                stream.write({ end: true });
//            });
//        },
//        
//        function(err) {
//            self.emit('error', err);
//        });
//}

/**
 */
function deleteUnpublished(videoId, successCb, errorCb) {
     
    videodb.deleteVideo(
        videoId, 
        function(result) {
            
            var fullPath = uploadPath + "/" + result.id + "." + result.extension;
            
            if(fs.existsSync(fullPath)) {
                try {
                    fs.unlinkSync(fullPath);
                } catch(e) {
                    if (e.code === 'ENOENT') {
                        return errorCb('File not found!');
                    } else {
                        return errorCb(e);
                    }
                }
                
                return successCb("Video removed");
            } else {
                return successCb("Video removed from db. It doesn't exist on filesystem");
            }
        },
        function(error) {
            errorCb(error);
        });
}

function deletePublished(videoId, successCb, errorCb) {
    
    videodb.deleteVideo(
        videoId, 
        function(result) {
            var fullPath = publishedVideosPath + "/" + result.id + "." + result.extension;
            
            if(fs.existsSync(fullPath)) {
                try {
                    fs.unlinkSync(fullPath);
                } catch(e) {
                    if (e.code === 'ENOENT') {
                        return errorCb('File not found!');
                    } else {
                        return errorCb(e);
                    }
                }
                
                return successCb("Video removed");
            } else {
                return successCb("Video removed from db. It doesn't exist on filesystem");
            }
        },
        function(error) {
            return errorCb(error);
        });
}

/**
 */
function approveUnpublished(videoId, successCb, errorCb) {

   videodb.approveVideo(
       videoId,
       function(data){
           
            var fullName =  data.id + "." + data.extension;
            var fullUploadPath = uploadPath + "/" + fullName;
            var fullPublishedPath = publishedVideosPath + "/" + fullName;
            
            fs.createReadStream(fullUploadPath) // Read File
                .on('error', function(e){ return errorCb(e); })
                // Write File
                .pipe(fs.createWriteStream(fullPublishedPath)) 
                .on('error', function(e){ return errorCb(e); })
                .on('finish', function() {
                    fs.unlink(fullUploadPath, function(err) {
                        if(err) {
                            return errorCb(err);
                        } else {
                            return successCb("OK");
                        }
                    });
                });
       },
       function(error){
           return errorCb(error);
       });
}

/********************************
        Exports
********************************/

module.exports = {
    list                : list,
    listUnpublished     : listUnpublished,
    request             : request,
    requestUnpublished  : requestUnpublished,
//    upload              : upload,
    deleteUnpublished   : deleteUnpublished,
    deletePublished     : deletePublished,
    approveUnpublished  : approveUnpublished,
    supportedTypes      : supportedTypes,
    supportedExtensions : supportedExtensions
};
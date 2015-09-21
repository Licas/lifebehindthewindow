'use strict';

var uploadPath,
    publishedVideosPath, 
    supportedTypes,
    supportedExtensions;

var Lazy = require("lazy.js");
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
       videodb.videoByID(
            meta.id, 
            function(video) {
                console.log("Found " + JSON.stringify(video));
        
                var file = fs.createReadStream(
                        publishedVideosPath + '/' + meta.id + '.' + video.extension,
                        { flags: 'r', autoClose: true });
                
                file.on('error', function(err) {
                    console.log("Error in request: " + err);
                    client.send(null);
                });

                var metaInfoFound = {
                        "username":video.username,
                        "userlocation":video.userlocation,
                        "extension":video.extension
                    };
                client.send(file, metaInfoFound);
            },
            function(err){
                console.log("Error " + err);
            });
    }
}

/**
* Get a video not yet published
*/
function requestUnpublished(client, meta) {
    //IMPREOVEMENT : CHECK EXTENSION/ STREAM FILE
    if(meta && meta.id) {
        videodb.videoByID(
            meta.id, 
            function(video) {
                var file = fs.createReadStream(
                        uploadPath + '/' + meta.id + '.' + video.extension,
                        { flags: 'r', autoClose: true });
                
                file.on('error', function(err) {
                    console.log("Error in request: " + err);
                    client.send(null);
                });


                if(file) {

                    var metaInfoFound = {
                            "username":video.username,
                            "userlocation":video.userlocation,
                            "extension":video.extension
                        };
                    client.send(file, metaInfoFound);

                } else {
                    client.send(null);
                }
            },
            function(err){
                console.log("Error " + err);
            });
        
    }
}

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

function upload(stream, meta) {
    if(!Lazy(meta.type).startsWith('video')) { 
//    if (!~supportedTypes.indexOf(meta.type)) {
        stream.write({ err: 'Unsupported type: ' + meta.type });
        stream.end();
        return;
    }
    console.log("File received: " + JSON.stringify(meta));
 
    /* 
    {"name":"MVI_9128.MOV", "size":16709784, "type":"video/quicktime", "username":"adada", "userlocation":"adad", "event":"upload"}
    */
    var filename = meta.name;
    var mimetype = meta.type;
    var username = meta.username;
    var userlocation = meta.userlocation;
    var extension = "";
    
    if(meta.name.indexOf(".") > 0) { 
        extension = meta.name.substr(meta.name.indexOf(".")+1);
    } else {
        extension = 'mp4';
    }
    
    var file = fs.createWriteStream(uploadPath + '/' + meta.name);
    stream.pipe(file);
 
    stream.on('error', function(err) {
        stream.end();
    });
    
    stream.on('data', function (data) {
        stream.write({ rx: data.length / meta.size });
    });
 
    stream.on('end', function () {
        stream.write({ end: true });
        
        videodb.createVideo({
            "title": filename,
            "username": username,
            "userlocation": userlocation,
            "extension": extension
            
        }, function(data){
            console.log("success in saving video on db: " + data);
            var objectID = data;
            
            if(!Lazy(mimetype).startsWith('video')) {
                fs.unlink(uploadPath + "/" + filename, function (err) {
                  if (err) 
                      console.log("Error: "+ err);
                  console.log('successfully deleted ' + uploadPath + "/" + filename);
                });

                console.log("Error in file format");
            }
//            
            fs.rename(uploadPath + "/" + filename, uploadPath + "/"  + objectID + "." + extension,
                  function(err) {
                    if ( err ) {
                        console.log("upload not done." +err);
                    }
            });
            
            console.log("upload done");
            
        }, function(err){
            console.log("error in saving video on db: " + err);
            
        });
    });
    
    
    
    
    
    
//    var originalName = req.file.originalname;
//    
//    if(req.file) {
//        
//        
//        var username = "";
//        var userlocation = "";
//        var extension = "";
//        
//        if(req.body.username) 
//            username = req.body.username;
//        
//        if(req.body.userlocation) 
//            userlocation = req.body.userlocation;
//        
//        if(req.file.originalname.indexOf(".") > 0) { 
//            extension = req.file.originalname.substr(req.file.originalname.indexOf(".")+1);
////            extension = req.file.mimetype.substr(req.file.mimetype.indexOf("/")+1);
//        } else {
//            extension = 'mp4';
//        }
//        db.createVideo({
//            "title": originalName,
//            "username": username,
//            "userlocation": userlocation,
//            "extension": extension
//            
//        }, function(data){
//            console.log("success in saving video on db: " + data);
//            var objectID = data;
//            
//            if(!Lazy(req.file.mimetype).startsWith('video')) {
//                fs.unlink(req.file.path, function (err) {
//                  if (err) 
//                      res.status(500).send("Error: "+ err);
//                  console.log('successfully deleted ' +req.file.path);
//                });
//
//                res.status(500).send("Error in file format");
//            }
//            
//            fs.rename(req.file.path, req.file.destination + objectID + "." + extension,
//                  function(err) {
//                    if ( err ) {
//                        res.status(500).send("upload not done." +err);
//                    }
//            });
//            
//            res.status(200).send("upload done");
//            
//        }, function(err){
//            console.log("error in saving video on db: " + err);
//            res.status(500).send("upload not done." +err);
//        });
//        
//      } else {
//          res.status(500).send("upload not done");
//      }
}

/********************************
        Exports
********************************/

module.exports = {
    list                : list,
    listUnpublished     : listUnpublished,
    request             : request,
    requestUnpublished  : requestUnpublished,
    upload              : upload,
    deleteUnpublished   : deleteUnpublished,
    deletePublished     : deletePublished,
    approveUnpublished  : approveUnpublished,
    supportedTypes      : supportedTypes,
    supportedExtensions : supportedExtensions
};

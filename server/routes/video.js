/*jslint node: true */
'use strict';
var express = require('express');
var videoRouter = express.Router();

var config = require('../lib/config');
var path = require('path');
var fs = require('fs');
var jsonfile = require('jsonfile')

var Lazy = require('lazy.js');
var log = require('winston');

var VideoModel = require('../model/VideoModel');
var db = require(__dirname + "/../controller/videodb");
var videomanager = require(__dirname + "/../lib/videomanager");

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var appDir = "";
var uploadFolder = config.uploadFolderName;
var videosFolder = config.videosFolderName;

if(config.storageprefix) {
    appDir = config.storageprefix;
} else {
    appDir = path.dirname(require.main.filename);
}

var publishedVideosPath =  appDir + "/" + videosFolder;
var uploadDir = appDir + "/" + uploadFolder;

console.log("publishedVideosPath " + publishedVideosPath);
console.log("uploadDir " + uploadDir);



if (!fs.existsSync(publishedVideosPath)){
    fs.mkdirSync(publishedVideosPath);
}
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDirso);
}

videoRouter.get('/list', function(req, res, next) {
    fs.readdir( publishedVideosPath, function (err, files) {
           var newList = [];
            if(err) {
                res.status(500).send(err);
            }
           for( var i in files ) {
            if(files[i].endsWith(videomanager.supportedExtensions[0]) ||
                files[i].endsWith(videomanager.supportedExtensions[1]) ||
                files[i].endsWith(videomanager.supportedExtensions[2])) {
                    newList.push(files[i]);  
                } 
           }
         
            res.send({ files : newList });
        });
});

videoRouter.get('/get', function(req, res, next) {
//    console.log("required video " + req.query.videoid);
    
  res.status(200).send( 'Retrieving video ' + req.query.videoid );
});

videoRouter.get('/delete/unpublished', function(req, res, next) {
    if(req.query.videoname) {
        console.log("request for delete " + req.query.videoname);
        videomanager.deleteUnpublished(
            req.query.videoname, 
            function(msg) { //success
                res.status(200).send('OK ' + msg);
            },
            function(err) { //error
                res.status(500).send('ERROR ' + err);
            });
    }
    
    res.status(200).send('OK');
});

videoRouter.get('/delete/published', function(req, res, next) {
    if(req.query.videoname) {
        console.log("request for delete " + req.query.videoname);
        videomanager.deletePublished(req.query.videoname);
    }
    
    res.status(200).send( 'OK');
});

videoRouter.get('/approve/unpublished', function(req, res, next) {
    if(req.query.videoname) {
        console.log("request for approve " + req.query.videoname);
        videomanager.approveUnpublished(req.query.videoname);
    }
    
    res.status(200).send( 'OK');
});

/* upload handler */
//videoRouter.post('/upload', upload.single('file'), function(req, res, next) {
//    if(req.file) {
//        log.info('file: %s - size: %d (%s) - located in: %s',  
//                    req.file.originalname, 
//                    req.file.size,
//                    req.file.mimetype,
//                    req.file.path);
//        
//        if(!Lazy(req.file.mimetype).startsWith('video')) {
//            fs.unlink(req.file.path, 
//                      function (err) {
//                          if (err) 
//                              res.status(500).send("Error: "+ err);
//                          console.log('successfully deleted ' +req.file.path);
//            });
//
//            res.status(500).send("Error in file format");
//        }
//    
//        fs.rename(req.file.path, 
//                  req.file.destination + req.file.originalname, 
//                  function(err) {
//                    if ( err ) {
//                        console.log('ERROR: ' + err);
//                        res.status(500).send("Error: "+ err);
//                    }});
//        
//        res.status(200).send("OK");
//    } else {
//        res.status(500).send("No file found");
//    }
//});
            



module.exports = videoRouter;
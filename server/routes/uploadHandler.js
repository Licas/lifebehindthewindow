/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var Lazy = require('lazy.js');
var log = require('winston');
var fs = require('fs');

var config = require('../lib/config');
var appDir = "";
var uploadFolder = config.uploadFolderName;
var videosFolder = config.videosFolderName;

if(config.storageprefix) {
    appDir = config.storageprefix;
} else {
    appDir = path.dirname(require.main.filename);
}

var multer  = require('multer')
var upload = multer({ dest: appDir + "/" + uploadFolder +"/"})

var VideoModel = require(__dirname + "/../model/VideoModel");
var db = require(__dirname + "/../controller/videodb");


/* upload handler */
router.post('/api/upload', upload.single('file'), function(req, res, next) {
    log.info("/api/upload invocation");
    /*{
        "fieldname": "file",
        "originalname": "mod_pri_background_v3.1(1).zip",
        "encoding": "7bit",
        "mimetype": "application/zip",
        "destination": "uploads/",
        "filename": "83f36edfdfba53db3d2a6a6d8bf1c225",
        "path": "uploads/83f36edfdfba53db3d2a6a6d8bf1c225",
        "size": 40714
    }*/
    
    var originalName = req.file.originalname;
    
    if(req.file) {
        log.info(' file: %s - size: %d (%s) - located in: %s',  
                    req.file.originalname, 
                    req.file.size,
                    req.file.mimetype,
                    req.file.path
        );
        log.info(JSON.stringify(req.file));
        
        var username = "";
        var userlocation = "";
        var extension = "";
        
        if(req.body.username) 
            username = req.body.username;
        
        if(req.body.userlocation) 
            userlocation = req.body.userlocation;
        
        if(req.file.originalname.indexOf(".") > 0) {
            extension = req.file.originalname.substr(req.file.originalname.indexOf(".")+1);
//            extension = req.file.mimetype.substr(req.file.mimetype.indexOf("/")+1);
        } else {
            extension = 'mp4';
        }
        db.createVideo({
            "title": originalName,
            "username": username,
            "userlocation": userlocation,
            "extension": extension
            
        }, function(data){
            console.log("success in saving video on db: " + data);
            var objectID = data;
            
            if(!Lazy(req.file.mimetype).startsWith('video')) {
                fs.unlink(req.file.path, function (err) {
                  if (err) 
                      res.status(500).send("Error: "+ err);
                  console.log('successfully deleted ' +req.file.path);
                });

                res.status(500).send("Error in file format");
            }
            
            fs.rename(req.file.path, req.file.destination + objectID + "." + extension,
                  function(err) {
                    if ( err ) {
                        res.status(500).send("upload not done." +err);
                    }
            });
            
            res.status(200).send("upload done");
            
        }, function(err){
            console.log("error in saving video on db: " + err);
            res.status(500).send("upload not done." +err);
        });
        
      } else {
          res.status(500).send("upload not done");
      }
});
            

module.exports = router;
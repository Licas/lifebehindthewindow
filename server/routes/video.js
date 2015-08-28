/*jslint node: true */
'use strict';
var express = require('express');
var videoRouter = express.Router();

var Lazy = require('lazy.js');
var log = require('winston');

var fs = require('fs');
var jsonfile = require('jsonfile')

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var watch = require('watch');
var watchedDir = 'videos/';
var videoListFile =  __dirname +  "/publishedvideos.json";

var util = require(__dirname + "/../lib/videomanager");

var monitorOpts = {
    "ignoreDotFiles":true,
    "ignoreUnreadableDir":true,
    "ignoreNotPermitted":true
};

  watch.createMonitor(watchedDir, monitorOpts, function (monitor) {
    //monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
    monitor.on("created", function (f, stat) {
      // Handle new files
        console.log("New file added " + f);
        var fileJSON = jsonfile.readFileSync(videoListFile);
        var newVideo = {
            "name":f
        }

        fileJSON.published_videos.push(newVideo);
        jsonfile.writeFileSync(videoListFile, fileJSON);
    })
    monitor.on("changed", function (f, curr, prev) {
      // Handle file changes
        
        console.log("File " + f + " has changed");
    })
    monitor.on("removed", function (f, stat) {
      // Handle removed files
        console.log("File " + f + " has been removed");
        var fileJSON = jsonfile.readFileSync(videoListFile);
        
        function filterRemovedVideo(element) {
            if( element.name == f ) {
                    console.log(JSON.stringify(element));
                return true;
            }
            return false;
        }        
        var remElem = Lazy(fileJSON.published_videos)
            .filter(filterRemovedVideo)
            .first();
        if(remElem) {
            var index = Lazy(fileJSON.published_videos).indexOf(remElem);
            
            console.log("Rem elem [" + index + "] "+ JSON.stringify(remElem));
            delete fileJSON.published_videos[index];
            fileJSON.published_videos = fileJSON.published_videos.filter(function(el){
                return el !== null;
            });
            jsonfile.writeFileSync(videoListFile, fileJSON);
        }
    })
    //monitor.stop(); // Stop watching
  })

videoRouter.get('/list', function(req, res, next) {
  //res.send( 'Check for new videos.' );
    var fileJSON = jsonfile.readFileSync(videoListFile);
    
    res.send(fileJSON);
});

videoRouter.get('/get', function(req, res, next) {
//    console.log("required video " + req.query.videoid);
    
  res.send( 'Retrieving video ' + req.query.videoid );
});

/* upload handler */
videoRouter.post('/upload', upload.single('file'), function(req, res, next) {
//    log.info("/upload invocation");
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
      if(req.file) {
    log.info(' file: %s - size: %d (%s) - located in: %s',  
                req.file.originalname, 
                req.file.size,
                req.file.mimetype,
                req.file.path
    );
        
    if(!Lazy(req.file.mimetype).startsWith('video')) {
        fs.unlink(req.file.path, function (err) {
          if (err) 
              res.status(500).send("Error: "+ err);
          console.log('successfully deleted ' +req.file.path);
        });
        
        res.status(500).send("Error in file format");
    }
    
    fs.rename(req.file.path, req.file.destination+req.file.originalname, function(err) {
        if ( err ) {
            console.log('ERROR: ' + err);
            res.status(500).send("Error: "+ err);
        }
    });
    
    res.send(req.file);
      } else {
        res.status(500).send("No file found");
      }
});
            



module.exports = videoRouter;
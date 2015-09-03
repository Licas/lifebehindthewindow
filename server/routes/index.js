/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var Lazy = require('lazy.js');
var log = require('winston');
var fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var VideoModel = require(__dirname + "/../model/VideoModel");
var db = require(__dirname + "/../controller/videodb");


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Upload Integration Data Layer Object' });
});

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
            }
        });
        
        var username = "";
        var userlocation = "";
        
        if(req.body.username) 
            username = req.body.username;
        
        if(req.body.userlocation) 
            userlocation = req.body.userlocation;
        
        db.createVideo({
            "title": originalName,
            "username": username,
            "userlocation": userlocation
            
        }, function(msg){
            console.log("success in saving video on db: " + msg);
        }, function(error){
            console.log("error in saving video on db: " + error);
        });
        
        res.status(200).send("upload done");
        
      } else {
        res.status(500).send("upload not done");
      }
});
            

module.exports = router;
/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var Lazy = require('lazy.js');
var log = require('winston');
var fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var watch = require('node-watch');


/* GET home page. */
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
            
    
watch('videos/', function(filename) {
if (filename) {
    console.log('filename provided: ' + filename);
  } else {
    console.log('filename not provided');
  }
});


module.exports = router;
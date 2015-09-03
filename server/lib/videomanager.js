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

if(config.storageprefix) {
    appDir = config.storageprefix;
} else {
    appDir = path.dirname(require.main.filename);
}

publishedVideosPath = appDir +  "/" + videosFolder;
uploadPath = appDir + "/" + uploadFolder;
//publishedVideosPath = appDir+'/videos';
//uploadPath = appDir+'/uploads';

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
 */
function list(stream, meta)  {
    _checkUploadDir(function () {
        fs.readdir( publishedVideosPath, function (err, files) {
           var newList = [];
            
           for( var i in files ) {
            if(files[i].endsWith(supportedExtensions[0]) ||
                files[i].endsWith(supportedExtensions[1]) ||
                files[i].endsWith(supportedExtensions[2])) {
                    newList.push(files[i]);  
                } 
           }
         
            stream.write({ files : newList });
        });
    });
}

function listUnpublished(stream, meta)  {
    _checkUploadDir(function () {
        fs.readdir( uploadPath, function (err, files) {
           var newList = [];
            
           for( var i in files ) {
            if(files[i].endsWith(supportedExtensions[0]) ||
                files[i].endsWith(supportedExtensions[1]) ||
                files[i].endsWith(supportedExtensions[2])) {
                    newList.push(files[i]);  
                } 
           }
            stream.write({ files : newList });
        });
    });
}

function request(client, meta) {
    if(meta && meta.name) {
        var file = fs.createReadStream(
                        publishedVideosPath + '/' + meta.name,
                        { flags: 'r', autoClose: true });
        file.on('error', function(err) {
            console.log("Error in request: " + err);
            client.send(null);
        });
        client.send(file);
    }
}

/**
*/
function requestUnpublished(client, meta) {
    if(meta && meta.name) {
        var file = fs.createReadStream(
                        uploadPath + '/' + meta.name,
                        { flags: 'r', autoClose: true });
//        console.log("Sending file " + meta.name);
        file.on('error', function(err) {
            console.log("Error in requestUnpublished: " + err);
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
function upload(stream, meta) {
    console.log("UPLOADING IN SERVER");
    if (!~supportedTypes.indexOf(meta.type)) {
        stream.write({ err: 'Unsupported type: ' + meta.type });
        stream.end();
        return;
    }

    var file = fs.createWriteStream(uploadPath + '/' + meta.name);
    stream.pipe(file);

    stream.on('data', function (data) {
        stream.write({ rx : data.length / meta.size });
    });

    stream.on('end', function () {
        stream.write({ end: true });
    });
}

/**
 */
function deleteUnpublished(file) {
    var fullPath = uploadPath + "/" + file;

    if(fs.existsSync(fullPath)) {
        fs.unlinkSync( fullPath);
    } else {
//        console.log("File doesn't exist");
    }
}

function deletePublished(file) {
    var fullPath = publishedVideosPath + "/" + file;

    if(fs.existsSync(fullPath)) {
        fs.unlinkSync( fullPath);
    } else {
//        console.log("File doesn't exist");
    }
}

/**
 */
function approveUnpublished(file) {
//    console.log("UPLOADING IN SERVER");
    var fullPath = uploadPath + "/" + file;
    if(fs.existsSync(fullPath)) {
//        console.log("file exists, i'll delete asap."+fullPath);
        var theFile = fs.readFileSync(fullPath);
        if(theFile) {
            var publishedPath = publishedVideosPath + "/" + file;
            fs.writeFile(publishedPath, theFile, function(data,err){
            
                if(err) {
                    console.log(err);
                    return err;
                }
                fs.unlinkSync( fullPath);
            });
        }
                        
    } else {
//        console.log("File doesn't exist");
    }
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
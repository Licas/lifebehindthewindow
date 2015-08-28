/**
 * Manages uploading and streaming of video files.
 *
 * @module video
 */
'use strict';

var fs, 
    uploadPath,
    publishedVideosPath, 
    supportedTypes,
    supportedExtensions;

fs = require('fs');

publishedVideosPath =   './videos';
uploadPath = './uploads';

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

/**
 */
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
//    console.log("UPLOADING IN SERVER");
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

/********************************
        Exports
********************************/

module.exports = {
    list                : list,
    listUnpublished     : listUnpublished,
    request             : request,
    requestUnpublished  : requestUnpublished,
    upload              : upload
};
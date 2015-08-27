/**
 * Manages uploading and streaming of video files.
 *
 * @module video
 */
'use strict';

var fs, uploadPath,publishedVideosPath, supportedTypes;

fs = require('fs');

publishedVideosPath =   './videos';
uploadPath = './uploads';

supportedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg'
];

module.exports = {
    list    : list,
    request : request,
    upload  : upload
};

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

/**
 */
function list(stream, meta)  {
    _checkUploadDir(function () {
        fs.readdir( publishedVideosPath, function (err, files) {
            stream.write({ files : files });
        });
    });
}

/**
 */
function request(client, meta) {
    var file = fs.createReadStream(publishedVideosPath + '/' + meta.name);
    console.log("Sending file " + meta.name);
    client.send(file);
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
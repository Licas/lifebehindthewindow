'use strict';

var mongoose = require('mongoose'),
    Video = mongoose.model('Video'),
    errorHandler = require('./errors.server.controller'),
     _ = require('lodash'),
    config = require('../lib/config');


mongoose.connect('mongodb://'+config.dbhost+':'+config.dbport+'/'+config.dbname);

/**
 * Create a video
 */
var createVid = function(data, success, error) {
    console.log("DB; " + JSON.stringify(data));
        var video = new Video(data);
        video.title = data.title;
        video.username = data.username;
        video.userlocation = data.userlocation;
    
        video.save(function(err) {
                if (err) {
                    error(errorHandler.getErrorMessage(err));
                } else {
                    success("OK");
                }
        });
};

/**
 * Show the current video
 */
var readVid = function(req, res) {
        res.json(req.video);
};



/**
 * Update a video
 */
var updateVid = function(req, res) {
        var video = req.video;

        video = _.extend(video, req.body);

        video.save(function(err) {
                if (err) {
                        return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                        });
                } else {
                        res.json(video);
                }
        });
};

/**
 * Delete an video
 */
var deleteVid = function(req, res) {
        var video = req.video;

        video.remove(function(err) {
                if (err) {
                        return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                        });
                } else {
                        res.json(video);
                }
        });
};



/**
 * List of Videos
 */
var listVid = function(req, res) {
        Video.find().sort('-created').populate('user', 'displayName').exec(function(err, videos) {
                if (err) {
                        return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                        });
                } else {
                        res.json(videos);
                }
        });
};

var videoByID = function(req, res, next, id) {

        if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send({
                        message: 'Video is invalid'
                });
        }

        Video.findById(id).populate('user', 'displayName').exec(function(err, video) {
                if (err) return next(err);
                if (!video) {
                        return res.status(404).send({
                                message: 'Video not found'
                        });
                }
                req.video = video;
                next();
        });
};


/********************************
        Exports
********************************/

module.exports = {
    videoByID: videoByID,
    videoList: listVid,
    deleteVideo: deleteVid,
    updateVideo: updateVid,
    readVideo:  readVid,
    createVideo: createVid
}
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
        var video           = new Video(data);
        video.title         = data.title;
        video.username      = data.username;
        video.userlocation  = data.userlocation;
        video.published     = false;
    
        video.save(function(err) {
            if (err) 
                error(errorHandler.getErrorMessage(err));
            
            Video.findById(video, function (err, doc) {
                if (err) 
                    error(errorHandler.getErrorMessage(err));
            
                success(doc._id); 
            });
        });
};


/**
 * Show the current video
 */
var readVid = function(req, res) {
        res.json(req.video);
};

/**
 * Approve an unpublished video
 */
var approveVid = function(videoId, successCb, errorCb) {
     
    Video.findByIdAndUpdate(
        videoId,
        { "published": true },
        function(err, result) {            
            if(err) {
                return errorCb(err);
            } else {
                return successCb(result);
            }
        });
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
var deleteVid = function(videoId, successCb, errorCb) {
    Video.findByIdAndRemove( 
        videoId, 
        function(err, result) {
            if (err) 
                return errorCb(errorHandler.getErrorMessage(err));
            
            return successCb(result);
    });
};

/**
 * List of Videos
 */
var listVid = function(published, successCb, errorCb) {
    
    Video.find({ "published": published })
        .sort('-created')
        .exec(function(err, videos) {
            if (err) 
                    return errorCb(errorHandler.getErrorMessage(err));
            return successCb(videos);
    });
};

var videoByID = function(id, successCb, errorCb) {

        if (!mongoose.Types.ObjectId.isValid(id)) {
                return errorCb('Video is invalid');
        }

        Video.findById(id).exec(function(err, video) {
                if (err) 
                    return errorCb(err);
                if (!video) {
                        return errorCb('Video not found');
                }
                return successCb(video);
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
    approveVideo: approveVid,
    readVideo:  readVid,
    createVideo: createVid
}
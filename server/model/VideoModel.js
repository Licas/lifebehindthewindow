'use strict';

var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
        created: {
                type: Date,
                default: Date.now
        },
        title: {
                type: String,
                default: '',
                required: 'Title cannot be blank'
        },
//        content: {
//                type: String,
//                default: '',
//                trim: true
//        },
        username: {
            type: String,
            defatul: ''
        },
        userlocation: {
            type: String,
            defatul: ''
        },
        extension: {
            type: String,
            defatul: 'mp4'
        },
        published: {
            type: Boolean,
            default: false
        }
});

mongoose.model('Video', VideoSchema);

module.exports = VideoSchema;
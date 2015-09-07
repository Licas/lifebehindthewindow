'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var AdminSchema = new Schema({
        username: {
                type: String,
                required: true,
                unique: true
        },
        password: {
                type: String,
                required: true
        }
});
//
//
//AdminSchema.methods.comparePassword = function(candidatePassword, cb) {
//    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//        if (err) return cb(err);
//        cb(null, isMatch);
//    });
//};
//

mongoose.model('Admin', AdminSchema);

module.exports = AdminSchema;
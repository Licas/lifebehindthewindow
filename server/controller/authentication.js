var mongoose = require('mongoose');
var Admin = mongoose.model('Admin');

function authenticate(username, password, cb) {

    var query = Admin.findOne({username:username, password:password});

    query.exec(function (err, user) {

        if (err) { 
            return cb(err, null); 
        }
        if (!user) { 
            return cb(null, false);
        }
        
        return cb(null, user);
    });
}



module.exports = {
    authenticate: authenticate
};

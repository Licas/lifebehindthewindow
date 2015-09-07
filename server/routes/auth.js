/*jslint node: true */
'use strict';
var express = require('express');
var adminRouter = express.Router();

var config = require('../lib/config');
var log = require('winston');

var AdminModel = require('../model/AdminModel');
var authController = require(__dirname + "/../controller/authentication");


adminRouter.get('/authenticate', function(req, res, next) {

    var auth = req.headers['authorization'];
//  console.log("Authorization Header is: ", auth);
    
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64'); 
    var plain_auth = buf.toString();
//  console.log("Decoded Authorization ", plain_auth);

    var creds = plain_auth.split(':');
    var username = creds[0];
    var password = creds[1];
    
    authController.authenticate(username, password, function(err, user){
            if(err) {
//                console.log("Authentication error :" + err);
                res.status(500).send("User not authorized");
            }
            else if(!user) {
//                console.log("Authentication error : user not found");
                res.status(500).send("User not found");
            }
            else {
//                console.log(user);
                res.status(200).send("OK");
            }
    });    
});


module.exports = adminRouter;
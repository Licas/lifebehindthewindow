var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./server/lib/config');

var routes = require('./server/routes/uploadHandler');
var videoRouter = require('./server/routes/video');
var authRouter = require('./server/routes/auth');

BinaryServer = require('binaryjs').BinaryServer;
videoManager = require('./server/lib/videomanager');

var app = express();

//app.set('port', process.env.PORT || 3000);


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'html');
app.use(express.static(__dirname));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods",['OPTIONS ','DELETE', 'GET', 'POST']);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,  Authorization");
    next();
});


app.use('/', routes);
app.use('/videos', videoRouter);
app.use('/api', authRouter);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
     .send( err.message +". " +err);
});


app.listen(process.env.PORT || config.port);
console.log("Listening on port: " + (process.env.PORT || config.port));

bs = new BinaryServer({ port: 9000 });

bs.on('connection', function (client) {
    console.log("connection from client");
    client.on('stream', function (stream, meta) {
        switch(meta.event) {
            case 'listUnpublished':
                videoManager.listUnpublished(stream, meta);
            break;
            // list available videos
            case 'list':
                videoManager.list(stream, meta);
                break;

            // request for a video
            case 'request':
                videoManager.request(client, meta);
                break;
                // request for a video
            case 'requestUnpublished':
                console.log("requestUnpublished#" + JSON.stringify(meta));
                videoManager.requestUnpublished(client, meta);
                break;

            // attempt an upload
            case 'upload':
            default:
                console.log("Client uploading..");
                videoManager.upload(stream, meta);
        }
    });
});

module.exports = app;

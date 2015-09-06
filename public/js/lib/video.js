video = (function () {
    return {
        list                : list,
        listUnpublished     : listUnpublished,
        request             : request,
        requestUnpublished  : requestUnpublished,
        upload              : upload,
        download            : download
    };

    function list(cb) {
        var stream = emit('list');
        
        stream.on('data', function (data) {
            cb(null, data.files);
        });

        stream.on('error', function(err) {
            cb(err,null);
        } );
    }
    
    function listUnpublished(cb) {
        var stream = emit('listUnpublished');

        stream.on('data', function (data) {
//            console.log("unpublished : " + data);
            cb(null, data.files);
        });

       stream.on('error', function(err) {
            cb(err,null);
        } );
    }

    function upload(file, cb) {
        var stream = emit('upload', {
            name  : file.name,
            size  : file.size,
            type  : file.type
        }, file);

        stream.on('data', function (data) {
            cb(null, data);
        });

        stream.on('error', function(err) {
            cb(err,null);
        } );
    }

    function request(id) {
        emit('request', { id : id });
    }
    
    function requestDownload(id) {
        emit('requestDownload', { id : id });
    }

    function requestUnpublished(id) {
        emit('requestUnpublished', { id : id });
    }

    function download(stream, cb) {
        var parts = [];

        stream.on('data', function (data) {
            parts.push(data);
        });

       stream.on('error', function(err) {
            cb(err,null);
        } );

        stream.on('end', function () {
            var src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
            
            cb(null, src);
        });
    }
})();

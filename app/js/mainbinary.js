$(document).ready(function () {

    var $video    = $("#video");   

    
    $video.attr({
        controls : true,
        autoplay : true
    });

    client.on('open', function () {
        var box = $("#uploadbox");
        console.log("client open connection");
        video.list(setupList);
        
        box.on('drop', setupDragDrop);
        box.on('dragenter', fizzle);
        box.on('dragover', fizzleOver);
    });

    client.on('stream', function (stream) {
        console.log("Client receiving streaming ");
        video.download(stream, function (err, src) {
            console.log("client downloaded a file " + src);
            
            var media  = $("#videogular-media");
            media.attr('vg-src' , src);
            
            var sourceElement = angular.element("videogular video");
            
            sourceElement[0].src = src;
            sourceElement[0].type = "video/mp4";
           
            var scope = $('#videogular-media').scope();
            console.log(scope);
        });
    });

    function setupList(err, files) {
        var $ul, $li;
        var $list     = $("#list");
        
        $list.empty();
        $ul   = $('<ul>').appendTo($list);

        files.forEach(function (file) {
            $li = $('<li>').appendTo($ul);
            $a  = $('<a>').appendTo($li);

            $a.attr('href', '#').text(file).click(function (e) {
                fizzle(e);

                var name = $(this).text();
                video.request(name);
            });
        });
    }

    function setupDragDrop(e) {
        
        fizzle(e);

        var file, tx;

        file = e.originalEvent.dataTransfer.files[0];
        tx   = 0;

        video.upload(file, function (err, data) {
            
            var $progress = $("#progress");
            var msg;

            if (data.end) {
                msg = "Upload complete: " + file.name;
console.log(msg);
                video.list(setupList);
            } else if (data.rx) {
                msg = Math.round(tx += data.rx * 100) + '% complete';
                console.log(msg);
            } else {
                // assume error
                msg = data.err;
                console.log(msg);
            }

            $progress.text(msg);
            
            if (data.end || data.err) {
                setTimeout(function () {
                    $progress.fadeOut(function () {
                        $progress.text('Drop file here');
                    }).fadeIn();
                }, 5000);
            }
        });
    }
});

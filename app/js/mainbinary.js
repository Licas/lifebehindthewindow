$(document).ready(function () {

    var $video    = $("#video");
//    box      = $("#uploadbox");
    var $progress = $("#progress");
    var $list     = $("#list");

    
    $video.attr({
        controls : true,
        autoplay : true
    });

    client.on('open', function () {
        var box = $("#uploadbox");
        console.log("client open connection");
        console.log("box " + JSON.stringify(box));
        video.list(setupList);
        
        box.on('drop', setupDragDrop);
        box.on('dragenter', fizzle);
        box.on('dragover', fizzleOver);
    });

    client.on('stream', function (stream) {
        video.download(stream, function (err, src) {
            if(!$video) {
                var $video    = $("#video");
                console.log("Video was null");
            }
            $video.attr('src', src);
        });
    });

    function setupList(err, files) {
        var $ul, $li;

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

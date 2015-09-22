$(document).ready(function () {
    
    client.on('open', function () {
        console.log("client open connection");
        video.list(setupList);
    });

    client.on('stream', function (stream, meta) {
        var extension = "";

        if(meta.extension.toUpperCase() === 'MOV') {
            extension = 'mp4';
        } else {
            extension = meta.extension;
        }

        video.download(stream, function (err, src) {
//            console.log("client received a stream " + src);
            var tv_main_channel = $("#tv_main_channel");
            
            if (tv_main_channel.length) {
                tv_main_channel.attr('src', src);
//                tv_main_channel.attr('type', 'video/' + extension);

                $('#videometa').attr('style','display');
                $('#user').text(meta.username);
                $('#location').text(meta.userlocation);
                var video_block = $('#videoplayer');

                if(video_block) {
                    video_block.load();
//                    video_block.get(0).play();
                    $('#videoplayer').trigger('click');
                }

            }
            
            var media  = $("#videogular-media");
            if(media.length) {
                media.attr('vg-src' , src);

                var sourceElement = angular.element("videogular video");

                if(sourceElement) {
                    if(!sourceElement[0]) {
                        sourceElement[0] = {}
                    }
                    sourceElement[0].src = src;
                    sourceElement[0].type = "video/" + extension;
                }
            }

            var videomgmt = $("#videomgmt");   
            
            if(videomgmt.length) {
                if(angular.element("#mgmtPage").scope().view) {
                    angular.element("#mgmtPage").scope().view=false;
                    
                    videomgmt.on('ended', function() {
                        angular.element("#mgmtPage").scope().videoplaying = false;
                        angular.element("#mgmtPage").scope().$apply();
                    });

                    var sourceVideomgmt = $("#videomgmt_channel");

                    sourceVideomgmt.attr('src',src);
                    sourceVideomgmt.attr('type', 'video/' + extension);

                    videomgmt.load();
                    videomgmt.get(0).play();
                    angular.element("#mgmtPage").scope().videoplaying = true;
                    angular.element("#mgmtPage").scope().$apply();
                }
                
                if(angular.element("#mgmtPage").scope().download) {
//                    console.log("gonna download");
                    angular.element("#mgmtPage").scope().download = false;
                    
                    var link = document.getElementById("lnkDownload");
  
                    link.setAttribute("target","_self");
                    link.setAttribute("href", src);
                    link.setAttribute("download","video." + meta.extension);
                    link.click();
                    link.setAttribute("href","");                    
                }
            }
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
});

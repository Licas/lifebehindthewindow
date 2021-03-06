$(document).ready(function () {
    
    client.on('open', function () {
        console.log("client open connection");
        videoUtilities.list(setupList);
    });

    client.on('stream', function (stream, meta) {
        var extension = "";
//        console.log("client received a stream " + JSON.stringify(meta));

        $('#temp_poster').attr('src',meta.src+".png");

        if(meta.extension.toUpperCase() === 'MOV') {
            extension = 'mp4';
        } else {
            extension = meta.extension;
        }

        videoUtilities.download(stream, function (err, src) {
//            console.log("client received a stream " + meta.src + ", " + JSON.stringify(meta));

            var tv_main_channel_ogg = $("#tv_main_channel_ogg");
            var tv_main_channel_mp4 = $("#tv_main_channel_mp4");
            var tv_main_channel_webm = $("#tv_main_channel_webm");
            var tv_main_channel_mov = $("#tv_main_channel_mov");
            var tv_main_channel_m4v = $("#tv_main_channel_m4v");
            var sourceVideomgmt_orig = $("#tv_main_channel_orig");

            if ($('#videoplayer').length) {
                $( '#videoplayer').attr('poster', meta.src + ".png");
//                tv_main_channel.attr('src', src);

                sourceVideomgmt_orig.attr('src', meta.src + "." + meta.extension);
                tv_main_channel_ogg.attr('src', meta.src + ".ogg");
                tv_main_channel_webm.attr('src', meta.src + ".webm");
                tv_main_channel_mp4.attr('src', meta.src + ".mp4");
                tv_main_channel_mov.attr('src', meta.src + ".mov");
                tv_main_channel_m4v.attr('src', meta.src + ".m4v");


                $('#videometa').attr('style','display');
                $('#user').text(meta.username);
                $('#location').text(meta.userlocation);
                $( '#videoplayer').get(0).load();
                $( '#videoplayer').get(0).play();

            }
            
//            var media  = $("#videogular-media");
//            if(media.length) {
//                media.attr('vg-src' , src);
//
//                var sourceElement = angular.element("videogular video");
//
//                if(sourceElement) {
//                    if(!sourceElement[0]) {
//                        sourceElement[0] = {}
//                    }
//                    sourceElement[0].src = src;
//                    sourceElement[0].type = "video/" + extension;
//                }
//            }

            var videomgmt = $("#videomgmtplayer");
            
            if(videomgmt.length) {
                if(angular.element("#mgmtPage").scope().view) {
                    angular.element("#mgmtPage").scope().view=false;
                    
                    videomgmt.on('ended', function() {
                        angular.element("#mgmtPage").scope().videoplaying = false;
                        angular.element("#mgmtPage").scope().$apply();
                    });

                    var sourceVideomgmt_ogg = $("#videomgmtplayer_channel_ogg");
                    var sourceVideomgmt_webm = $("#videomgmtplayer_channel_webm");
                    var sourceVideomgmt_mp4 = $("#videomgmtplayer_channel_mp4");
                    var sourceVideomgmt_orig = $("#videomgmtplayer_main_channel_orig");

                    sourceVideomgmt_orig.attr('src', meta.src + "." + meta.extension);
                    sourceVideomgmt_ogg.attr('src', meta.src + ".ogv");
                    sourceVideomgmt_webm.attr('src', meta.src + ".webm");
                    sourceVideomgmt_mp4.attr('src', meta.src + ".mp4");


                    videomgmt.load();

                    angular.element("#mgmtPage").scope().videoplaying = true;
                    angular.element("#mgmtPage").scope().$apply();
                }
                else if(angular.element("#mgmtPage").scope().download) {
//                    console.log("gonna download");
                    angular.element("#mgmtPage").scope().download = false;
                    
                    var link = document.getElementById("lnkDownload");
  
                    link.setAttribute("target","_self");
                    link.setAttribute("href", meta.src + "." + meta.extension);
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
                videoUtilities.request(name);
            });
        });
    }
});

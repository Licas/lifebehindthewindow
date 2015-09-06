$(document).ready(function () {
    
    client.on('open', function () {
        console.log("client open connection");
        video.list(setupList);
    });

    client.on('stream', function (stream) {
        video.download(stream, function (err, src) {
            console.log("client received a stream " + src);
            
            var media  = $("#videogular-media");
            media.attr('vg-src' , src);
            
            var sourceElement = angular.element("videogular video");
            
            if(sourceElement) {
                if(!sourceElement[0]) {
                    sourceElement[0] = {}
                }
                sourceElement[0].src = src;
                sourceElement[0].type = "video/mp4";
            }
            
            var videomgmt = $("#videomgmt");   
            
            if(videomgmt) {
                if(angular.element("#mgmtPage").scope().view) {
                    console.log("gonna view");
                    angular.element("#mgmtPage").scope().view=false;
                    
                    videomgmt.bind('ended', function() { 
                        angular.element("#mgmtPage").scope().videoplaying = false;
                        angular.element("#mgmtPage").scope().$apply();
                    });

                    videomgmt.attr('src',src);  
                    
                    angular.element("#mgmtPage").scope().videoplaying = true;
                    angular.element("#mgmtPage").scope().$apply();
                }
                
                if(angular.element("#mgmtPage").scope().download) {
                    console.log("gonna download");
                    angular.element("#mgmtPage").scope().download = false;
                    
                    var link = document.getElementById("lnkDownload");
  
                    link.setAttribute("target","_self");
                    link.setAttribute("href", src);
                    link.setAttribute("download","video.mp4");
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

var hostname, client, port;

port = 9000;
hostname = window.location.hostname;

//console.log("ws host:" + hostname);

//console.log("Hostname " + hostname);
client   = new BinaryClient('ws://' + hostname + ':' + port);

function fizzle(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).css('border', '2px solid #0B85A1');
}

function fizzleOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function emit(event, data, file) {
    file       = file || {};
    data       = data || {};
    data.event = event;

    return client.send(file, data);
}

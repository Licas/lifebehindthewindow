var hostname, client;

hostname = window.location.hostname;
client   = new BinaryClient('ws://' + 'localhost' + ':9000');

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

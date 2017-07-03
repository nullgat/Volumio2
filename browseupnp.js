var Client = require('node-ssdp').Client;
var client = new Client();
var xml2js = require('xml2js');
var http = require('http');


client.search('urn:schemas-upnp-org:device:MediaServer:1')


client.on('response', function inResponse(headers, code, rinfo) {
    //console.log('Got a response to an m-search:\n%d\n%s\n%s', code, JSON.stringify(headers, null, '  '), JSON.stringify(rinfo, null, '  '))
    //console.log('CODE: '+code)
    //console.log('HEADERS: '+JSON.stringify(headers, null, '  '));
    //console.log('INFO: '+ JSON.stringify(rinfo, null, '  '))
    addUpnpServer(headers);
})

setTimeout(function() {

    client.search('urn:schemas-upnp-org:device:MediaServer:1')
}, 30000)


function addUpnpServer(headers) {
    var UpnpHeaders = headers
    xmlToJson(headers.LOCATION, function(err, data) {
        if (err) {
            // Handle this however you like
            return console.err(err);
        }
        var headers = headers;
        var upnpServerName = data.device.friendlyName;
        var upnpServerUDN = data.device.udn;
        var upnpServerIcon = data.device.iconList.icon[0].url;

        console.log(upnpServerName)
        console.log(JSON.stringify(data, null, 2));
    });
}






function xmlToJson(url, callback) {

    var req = http.get(url, function(res) {
        var xml = '';

        res.on('data', function(chunk) {
            xml += chunk;
        });

        res.on('error', function(e) {
            callback(e, null);
        });

        res.on('timeout', function(e) {
            callback(e, null);
        });

        res.on('end', function() {
            var parser = new xml2js.Parser();
            parser.parseString(xml, function(err, result) {
                callback(null, result);
            });
        });
    });
}
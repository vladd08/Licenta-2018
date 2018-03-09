const 
    express = require('express'),
    https = require('https'),
    debug = require('debug')('smart-office-api:server'),
    fs = require("fs");
   
const options = {
    key: fs.readFileSync('./bin/keys/server.key'),
    cert: fs.readFileSync('./bin/keys/server.crt'),
    requestCert: true,
    rejectUnauthorized: false
};

module.exports = function() {
    let server = express(),
    create,
    start;

    create = function(config) {
        let routes = require('./routes');

        //Server settings
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);
        server.set('view engine', 'jade');

        // Set up routes
        routes.init(server);
    };

    start = function() {
        let hostname = server.get('hostname'),
            port = server.get('port');

        https.createServer(options, server).listen(port, function() {
            debug('Express server listening on - https://' + hostname + ':'+ port);
        });
    };

    return { 
        create: create,
        start: start
    };
};
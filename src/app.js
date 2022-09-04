const fs = require('fs');
const path = require('path');
const app = require('uWebSockets.js').App();
const { log } = require('../lib/logger');

app.get('/remote', (res, req) => {
    res.writeHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync(path.join(__dirname, '..', 'www-public', 'remote.html')));
});

app.ws('/ws', {

    idleTimeout: 40,
    maxBackpressure: 1024,
    maxPayloadLength: 2048,
    compression: app.DEDICATED_COMPRESSOR_8KB,

    open: (ws) => {
        log.info(`Opened connection`);
    },

    close: (ws, code, reason) => {
        log.info(`Closed connection`);
    },

    message: (ws, message, isBinary) => {
        const message_data = JSON.parse(Buffer.from(message).toString());
        const { event, data_payload } = message_data;
        //console.log(data_payload);

        if (event === "register.remote") {
            log.info(`Registered remote`);
        }
        else if(event === "register.canvas") {
            ws.subscribe('canvas_update');
        }
        else if(event === "update.remote") {
            app.publish('canvas_update', JSON.stringify({ event: 'update.canvas', data_payload: data_payload }));
        }else if(event === "click.remote") {
            app.publish('canvas_update', JSON.stringify({ event: 'click.canvas', data_payload: data_payload }));
        }
    },
});


app.get('/desktop', (res, req) => {
    res.writeHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync(path.join(__dirname, '..', 'www-public', 'desktop.html')));
});

app.get('/jquery.js', (res, req) => {
    res.writeHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync(path.join(__dirname, '..', 'www-public', 'jquery.js')));
});

module.exports = app;
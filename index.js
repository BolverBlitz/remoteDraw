require('dotenv').config();
const app = require('./src/app');
const { log } = require('./lib/logger');

app.listen(parseInt(process.env.PORT, 10) || 80, (listenSocket) => {

    if (listenSocket) {
        log.info(`Listening on port: ${process.env.PORT || 80}`);
    }

});
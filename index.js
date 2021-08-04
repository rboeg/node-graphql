'use strict'

require('dotenv').config();

const server = require('./server')

const port = process.env.PORT || 3000;

server.start({
    port: port
}).then(app => {
    console.log('[node] Application is now running on port ' + port);
})
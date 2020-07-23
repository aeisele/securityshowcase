'use strict';
const https = require('https')

// TODO: remove for PROD
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// TODO: get cookie from incoming request
const sessionId = '0131F1C5C158A39F1E7FCE79BDE92EF6';
const timeout = 5 * 1000; // millis
const options = {
    hostname: 'localhost',
    port: 8443,
    path: '/loggedin',
    method: 'GET',
    timeout: timeout,
    headers: {
        'accept': 'application/json',
        'cookie' : `JSESSIONID=${sessionId}`
    }
};

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    console.log("response headers: ", res.headers);

    res.on('data', d => {
        process.stdout.write(d);
    })
});

req.on('timeout', () => {
    console.error(`request timeout after ${timeout} millis`);
    req.destroy();
});

req.on('error', error => {
    if (req.connection.destroyed) {
        // nothing to do here
        console.log("error, but request already destroyed: ", error.message);
        return;
    }

    console.error(error);
});

req.end();
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
        'cookie': `JSESSIONID=${sessionId}`
    }
};

exports.handler = async (event) => {

    let responseBody = '';

    const isLoggedIn = await new Promise((resolve, reject) => {

        const req = https.request(options, res => {
            res.on('data', d => {
                responseBody += d;
            });

            res.on('end', () => {
                resolve(JSON.parse(responseBody).muddi);
            });
        });

        req.on('timeout', () => {
            console.error(`request timeout after ${timeout} millis`);
            req.destroy();
        });

        req.on('error', error => {
            reject(error);
        });

        req.end();
    });

    return isLoggedIn;
};

// TODO: remove for PROD
exports.handler().then(response => {
    console.log("response", response);
}).catch(error => {
    console.error("error", error);
});
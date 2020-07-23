'use strict';
const https = require('https')

// TODO: remove for PROD
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

exports.handler = (event, context, callback) => {

    async function isLoggedIn(sessionId) {

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

        let responseBody = '';

        return await new Promise((resolve, reject) => {

            const req = https.request(options, res => {
                res.on('data', d => {
                    responseBody += d;
                });

                res.on('end', () => {
                    resolve(JSON.parse(responseBody).loggedIn);
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
    }

    // TODO: remove for prod
    const olduri = event.mockUri;
    const sessionId = event.mockSessionId;

    if (/^\/my-fancy-guide\/secure(.*)/.test(olduri)) {
        isLoggedIn(sessionId).then(loggedIn => {
            console.log("loggedIn ", loggedIn)
            if (loggedIn) {
                console.log("todo: forward to secure page");
            } else {
                console.log("todo: forward to public page");
            }
        }).catch(error => {
            console.error("error", error);
            console.log("todo: forward to error page (?)");
        });
    }

};

// TODO: remove for PROD
// TODO: get cookie from incoming request
const sessionId = '0131F1C5C158A39F1E7FCE79BDE92EF6';

exports.handler({mockUri: '/my-fancy-guide/secure/muddi', mockSessionId: sessionId});
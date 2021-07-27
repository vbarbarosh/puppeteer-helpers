import Promise from 'bluebird';
import zlib from 'zlib';

/**
 *
 * @param page
 * @returns {{wait: (function(): *), resources: *[], off: off}}
 */
function puppeteer_size(page)
{
    const resources = [];
    const page_response_promises = [];

    page.on('request', page_request);
    page.on('response', page_response);
    return {resources, off, wait};

    function off() {
        page.off('response', page_response);
    }

    function wait() {
        return Promise.all(page_response_promises);
    }

    function page_request(http_request)
    {
        http_request.puppeteer_size_time = new Date();
    }

    async function page_response(http_response)
    {
        const requests = http_response.request().redirectChain().slice().concat(http_response.request()).map(function (http_request) {
            return {
                url: http_request.url(),
                method: http_request.method(),
                time: http_request.puppeteer_size_time,
            };
        });
        const response = {
            url: http_response.url(),
            status: http_response.status(),
            headers: http_response.headers(),
            size: null,
            size_gzip: null,
            time: new Date(),
        };

        // [2020-11-03T13:51:53.572Z][puppeteer_response] 200 GET https://fonts.googleapis.com/css?family=Roboto:400,400i,700&subset=arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,gurmukhi,hebrew,japanese,kannada,khmer,korean,latin-ext,malayalam,myanmar,oriya,sinhala,tamil,telugu,thai,vietnamese
        // [2020-11-03T13:51:53.573Z][puppeteer_requestfinished]
        // [2020-11-03T13:51:53.575Z][puppeteer_response] 302 GET https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js
        // [2020-11-03T13:51:53.576Z][puppeteer_requestfinished]
        // [2020-11-03T13:51:53.576Z][puppeteer_request] GET https://unpkg.com/@lottiefiles/lottie-player@0.5.1/dist/lottie-player.js
        //
        // Unhandled rejection Error: Response body is unavailable for redirect responses
        switch (response.status) {
        case 301:
        case 302:
            return;
        }

        page_response_promises.push(new Promise(async function (resolve, reject) {
            try {
                const buffer = await http_response.buffer();
                response.size = buffer.length;
                response.size_gzip = (await gzip(buffer)).length;
                resources.push({requests, response});
                resolve();
            }
            catch (error) {
                reject(error);
            }
        }));
    }
}

function gzip(buffer)
{
    return new Promise(function (resolve, reject) {
        zlib.gzip(buffer, function (error, data) {
            error ? reject(error) : resolve(data);
        });
    });
}

export default puppeteer_size;

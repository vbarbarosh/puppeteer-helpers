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
    const page_promises = [];

    page.on('request', page_request);
    page.on('response', page_response);
    return {resources, off, wait};

    function off() {
        page.off('request', page_request);
        page.off('response', page_response);
    }

    function wait() {
        return Promise.all(page_promises);
    }

    function page_request(http_request)
    {
        page_promises.push(new Promise(function (resolve) {
            http_request.puppeteer_size_time = new Date();
            http_request.puppeteer_size_resolve = function () {
                if (resolve) {
                    resolve();
                    resolve = null;
                }
                else {
                    throw new Error('Already resolved');
                }
            };
        }));
    }

    async function page_response(http_response)
    {
        http_response.request().puppeteer_size_resolve();

        const response = {
            time: new Date(),
            url: http_response.url(),
            status: http_response.status(),
            headers: http_response.headers(),
            size: null,
            size_gzip: null,
        };

        // [2020-11-03T13:51:53.572Z][puppeteer_response] 200 GET https://fonts.googleapis.com/css?family=Roboto:400,400i,700&subset=arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,gurmukhi,hebrew,japanese,kannada,khmer,korean,latin-ext,malayalam,myanmar,oriya,sinhala,tamil,telugu,thai,vietnamese
        // [2020-11-03T13:51:53.573Z][puppeteer_requestfinished]
        // [2020-11-03T13:51:53.575Z][puppeteer_response] 302 GET https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js
        // [2020-11-03T13:51:53.576Z][puppeteer_requestfinished]
        // [2020-11-03T13:51:53.576Z][puppeteer_request] GET https://unpkg.com/@lottiefiles/lottie-player@0.5.1/dist/lottie-player.js
        switch (http_response.status()) {
        case 301:
        case 302:
            // Error: Response body is unavailable for redirect responses
            return;
        }

        page_promises.push(new Promise(async function (resolve) {
            let error = null;
            try {
                const buffer = await http_response.buffer();
                response.size = buffer.length;
                response.size_gzip = (await gzip(buffer)).length;
            }
            catch (_error) {
                error = {..._error, message: _error.message, stack: _error.stack};
                // [puppeteer_requestfailed] GET https://domain.com/.../video.mp4 net::ERR_ABORTED
                // Error: Protocol error (Network.getResponseBody): No data found for resource with given identifier
                switch (response.status) {
                case 206:
                    // "content-range": "bytes 0-17777969/17777970",
                    response.size = parseInt(response.headers['content-range'].split('/').pop());
                    break;
                default:
                    break;
                }
            }
            // The reason to assemble `requests` object here is because `http_request.failure()`
            // will return `null` when called before `await http_response.buffer()`.
            const requests = http_response.request().redirectChain().slice().concat(http_response.request()).map(function (http_request) {
                return {
                    time: http_request.puppeteer_size_time,
                    url: http_request.url(),
                    method: http_request.method(),
                    headers: http_request.headers(),
                    failure: (http_request.failure()||{}).errorText || null,
                    resource_type: http_request.resourceType(),
                };
            });
            resources.push({requests, response, error});
            resolve();
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

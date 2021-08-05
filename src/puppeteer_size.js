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
    const console_logs = [];

    page.on('console', page_console);
    page.on('request', page_request);
    page.on('response', page_response);
    page.on('requestfailed', page_requestfailed);
    page.on('requestfinished', page_requestfinished);

    return {resources, off, wait};

    function off() {
        page.off('console', page_console);
        page.off('request', page_request);
        page.off('response', page_response);
        page.off('requestfailed', page_requestfailed);
        page.off('requestfinished', page_requestfinished);
    }

    function wait() {
        return Promise.all(page_promises);
    }

    function page_console(console_message)
    {
        if (console_message.type() == 'error') {
            console_logs.push(new Date().toJSON() + ': ' + console_message.text());
        }
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

    // Access to font at 'https://fonts.gstatic.com/l/font?kit=HhyJU5sn9vOmLxNkIwRSjTVNWLEJN7MV2QEJlh_MimhQ83s&skey=91e90d677384bade&v=v19' from origin 'https://domain.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    // GET https://fonts.gstatic.com/l/font?kit=HhyJU5sn9vOmLxNkIwRSjTVNWLEJN7MV2QEJlh_MimhQ83s&skey=91e90d677384bade&v=v19 net::ERR_FAILED
    function page_requestfailed(http_request) {
        http_request.puppeteer_size_resolve();
        const logs = console_logs.filter(v => v.includes(http_request.url()));
        const requests = render_requests(http_request);
        const response = {
            time: new Date(),
            url: null,
            status: null,
            headers: null,
            size: null,
            size_gzip: null,
        };
        const error = {message: `Page Request Failed\n\n${logs.join('\n\n')}`};
        resources.push({requests, response, error});
    }

    function page_requestfinished(http_request) {
        http_request.puppeteer_size_resolve();
    }

    async function page_response(http_response)
    {
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
            const requests = render_requests(http_response.request());
            resources.push({requests, response, error});
            resolve();
        }));
    }
}

function render_requests(http_request_in)
{
    return http_request_in.redirectChain().slice().concat(http_request_in).map(function (http_request) {
        return {
            time: http_request.puppeteer_size_time,
            url: http_request.url(),
            method: http_request.method(),
            headers: http_request.headers(),
            failure: (http_request.failure()||{}).errorText || null,
            resource_type: http_request.resourceType(),
        };
    });
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

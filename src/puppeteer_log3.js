function puppeteer_log3(page, log = s => console.log(`[${new Date().toJSON()}]${s}`))
{
    const sym = Symbol('request_uid');
    const requests = [];
    const requests_map = {};

    page.on('*', all);
    return {
        off: function () {
            page.off('*', all);
        },
    };

    function all(name, arg1) {
        const req = (arg1 && arg1.method && arg1.url && arg1.initiator) ? arg1 : (arg1 && arg1.request ? arg1.request() : null);
        if (req) {
            if (!req[sym]) {
                const uid = `req_${requests.length}x`;
                req[sym] = uid;
                const tmp = {uid, url: req.url(), method: req.method(), started: Date.now(), events: [], headers: []};
                requests.push(tmp);
                requests_map[req[sym]] = tmp;
            }
            requests_map[req[sym]].events.push(name);
            requests_map[req[sym]].headers.push(JSON.stringify(arg1.headers()));
        }
        const uid = (req && req[sym]) ? `[${req[sym]}]` : '';
        const total = requests.length;
        const pending = requests.filter(v => !v.events.find(vv => vv !== 'request')).length;
        const time = req ? `+${Date.now() - requests_map[req[sym]].started}ms` : '';
        switch (name) {
        case 'request':
            log(`[puppeteer_request]${uid} pending=${pending} total=${total} ${req.method()} ${req.url()}`);
            break;
        case 'response':
            log(`[puppeteer_response]${uid} ${time} pending=${pending} total=${total}`.replace(/\s+/g, ' '));
            break;
        case 'requestfailed':
            log(`[puppeteer_requestfailed]${uid} ${time} pending=${pending} total=${total}`.replace(/\s+/g, ' '));
            break;
        case 'requestfinished':
            log(`[puppeteer_requestfinished]${uid} ${time} pending=${pending} total=${total}`.replace(/\s+/g, ' '));
            break;
        default:
            log(`[puppeteer_${name}]${uid} ${time} pending=${pending} total=${total}`.replace(/\s+/g, ' '));
            break;
        }
    }
}

module.exports = puppeteer_log3;

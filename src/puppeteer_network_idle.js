function puppeteer_network_idle(page, timeout = 30000)
{
    const uid = Symbol('puppeteer_network_idle');
    const requests = {};
    const started = Date.now();
    let last_network_event = Date.now();

    return new Promise(function (resolve, reject) {
        page.on('*', all);
        poll();
        function poll() {
            if (Date.now() - started >= timeout) {
                page.off('*', all);
                reject(new Error('Timeout'));
                return;
            }
            if (Object.values(requests).every(v => v.events.find(vv => vv != 'request'))) {
                if (Date.now() - last_network_event > 500) {
                    page.off('*', all);
                    resolve();
                    return;
                }
            }
            setTimeout(poll, 100);
        }
    });

    function all(name, v) {
        const request = (v && v.method && v.url && v.initiator) ? v : (v && v.request ? v.request() : null);
        if (request) {
            console.log(`puppeteer_network_idle: ${name}`);
            if (!request[uid]) {
                request[uid] = `req_${Object.keys(requests).length}`;
                requests[request[uid]] = {url: request.url(), method: request.method(), events: [], headers: []};
            }
            requests[request[uid]].events.push(name);
            requests[request[uid]].headers.push(JSON.stringify(v.headers()));
            last_network_event = Date.now();
        }
    }
}

module.exports = puppeteer_network_idle;

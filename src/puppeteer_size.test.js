const assert = require('assert');
const dev_proxy_routes = require('@vbarbarosh/dev-proxy/src/dev_proxy_routes');
const express = require('express');
const express_routes = require('@vbarbarosh/express-helpers/src/express_routes');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const fs_read_json = require('@vbarbarosh/node-helpers/src/fs_read_json');
const puppeteer = require('puppeteer');
const puppeteer_size = require('./puppeteer_size');
const urlclean = require('@vbarbarosh/node-helpers/src/urlclean');

describe('puppeteer_size', function () {
    it('https://example.com', async function () {
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            const size = puppeteer_size(page);
            await page.goto('https://example.com');
            await size.wait();
            const actual = size.resources.map(mapper1);
            assert.deepStrictEqual(actual, [{
                requests: [{url: 'https://example.com/'}],
                response: {url: 'https://example.com/', status: 200, size: 1256},
                error: null,
            }]);
        }
        finally {
            await browser.close();
        }
    });
    it('1-empty-page', async function () {
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            const size = puppeteer_size(page);
            await page.goto(`file://${fs_path_resolve(__dirname, 'puppeteer_size.d/1-empty-page/index.html')}`);
            await size.wait();
            const actual = size.resources.map(mapper1);
            assert.deepStrictEqual(actual, await fs_read_json(fs_path_resolve(__dirname, 'puppeteer_size.d/1-empty-page/expected.json')));
        }
        finally {
            await browser.close();
        }
    });
    it('2-image-duplicate - Image referenced by several IMG elements will be loaded once (will appear as a single request/response object}', async function () {
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            const size = puppeteer_size(page);
            await page.goto(`file://${fs_path_resolve(__dirname, 'puppeteer_size.d/2-image-duplicate/index.html')}`);
            await size.wait();
            const actual = size.resources.map(mapper1);
            assert.deepStrictEqual(actual, await fs_read_json(fs_path_resolve(__dirname, 'puppeteer_size.d/2-image-duplicate/expected.json')));
        }
        finally {
            await browser.close();
        }
    });
    it('3', async function () {
        const server = dev_proxy(fs_path_resolve(__dirname, 'puppeteer_size.d/3'));
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            const size = puppeteer_size(page);
            await page.goto('http://127.0.0.1:3000/static/');
            await size.wait();
            const actual = size.resources.map(mapper1);
            assert.deepStrictEqual(actual, await fs_read_json(fs_path_resolve(__dirname, 'puppeteer_size.d/3/expected.json')));
        }
        finally {
            server.close();
            await browser.close();
        }
    });
    it('4-request-chain', async function () {
        const server = dev_proxy(fs_path_resolve(__dirname, 'puppeteer_size.d/4-request-chain'));
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            const size = puppeteer_size(page);
            await page.goto('http://127.0.0.1:3000/proxy?url=http://127.0.0.1:3000/static/&redirects=2');
            await size.wait();
            const actual = size.resources.map(mapper1);
            assert.deepStrictEqual(actual, await fs_read_json(fs_path_resolve(__dirname, 'puppeteer_size.d/4-request-chain/expected.json')));
        }
        finally {
            server.close();
            await browser.close();
        }
    });
    it('5-google-fonts', async function () {
        const server = dev_proxy(fs_path_resolve(__dirname, 'puppeteer_size.d/5-google-fonts'));
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            const size = puppeteer_size(page);
            await page.goto('http://127.0.0.1:3000/static/');
            await size.wait();
            size.resources.sort((a,b) => a.response.url && b.response.url && a.response.url.localeCompare(b.response.url));
            const actual = size.resources.map(mapper1);
            assert.deepStrictEqual(actual, await fs_read_json(fs_path_resolve(__dirname, 'puppeteer_size.d/5-google-fonts/expected.json')));
        }
        finally {
            server.close();
            await browser.close();
        }
    });
    it('6-google-fonts-request-failed', async function () {
        const server = dev_proxy(fs_path_resolve(__dirname, 'puppeteer_size.d/6-google-fonts-request-failed'));
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            const size = puppeteer_size(page);
            await page.goto('http://127.0.0.1:3000/static/');
            await size.wait();
            size.resources.sort((a,b) => a.response.url && b.response.url && a.response.url.localeCompare(b.response.url));
            const actual = size.resources.map(mapper1);
            assert.deepStrictEqual(actual, await fs_read_json(fs_path_resolve(__dirname, 'puppeteer_size.d/6-google-fonts-request-failed/expected.json')));
        }
        finally {
            server.close();
            await browser.close();
        }
    });
    it('7-video', async function () {
        const server = dev_proxy(fs_path_resolve(__dirname, 'puppeteer_size.d/7-video'));
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            const size = puppeteer_size(page);
            await page.goto('http://127.0.0.1:3000/static/');
            await size.wait();
            size.resources.sort((a,b) => a.response.url && b.response.url && a.response.url.localeCompare(b.response.url));
            const actual = size.resources.map(mapper1);
            assert.deepStrictEqual(actual, await fs_read_json(fs_path_resolve(__dirname, 'puppeteer_size.d/7-video/expected.json')));
        }
        finally {
            server.close();
            await browser.close();
        }
    });
});

function mapper1(item)
{
    return {
        requests: item.requests.map(v => ({url: clean_url(urlclean(v.url))})),
        response: {
            url: item.response.url && clean_url(urlclean(item.response.url)),
            status: item.response.status,
            size: item.response.size,
        },
        error: item.error,
    };
}

function clean_url(url)
{
    return url.replace(`file://${__dirname}`, 'file://.');
}

function dev_proxy(dir)
{
    const app = express();
    app.use('/static', express.static(dir));
    app.use(function (req, res, next) {
        req.log = function () {};
        next();
    });
    fs_path_resolve(__dirname, 'puppeteer_size.d/2/index.html')
    express_routes(app, dev_proxy_routes());
    return app.listen(3000);
}

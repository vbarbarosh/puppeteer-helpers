const assert = require('assert');
const puppeteer = require('puppeteer');
const puppeteer_eval = require('./puppeteer_eval');

const items = [
    {eval: 'new Promise(resolve => setTimeout(() => resolve(12345), 1))', expected: 12345},
    {eval: '{foo: 12345}', expected: {foo: 12345}},
    {eval: '{foo: await new Promise(resolve => setTimeout(() => resolve(12345), 1))}', expected: {foo: 12345}},
    {eval: 'function () { return 12345; }', expected: 12345},
    {eval: 'async function () { await new Promise(resolve => setTimeout(resolve, 1)); return 12345; }', expected: 12345},
];

describe('puppeteer_eval', function () {
    items.forEach(function (item) {
        it(item.eval, async function () {
            const browser = await puppeteer.launch();
            try {
                const page = await browser.newPage();
                const actual = await puppeteer_eval(page, item.eval);
                assert.deepStrictEqual(actual, item.expected);
            }
            finally {
                await browser.close();
            }
        });
    });
});

A set of helpers for [Puppeteer](https://pptr.dev/).

## Installation

```shell
npm install vbarbarosh/puppeteer-helpers
```

## Basic usage

```javascript
#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const puppeteer = require('puppeteer');
const puppeteer_log = require('@vbarbarosh/puppeteer-helpers/src/puppeteer_log');

cli(main);

async function main()
{
    const browser = await puppeteer.launch();

    try {
        const page = puppeteer_log(await browser.newPage());
        await page.setViewport({width: 1280, height: 768});
        await page.goto('http://example.com');
        await page.screenshot({path: 'a.png', fullPage: true, omitBackground: true});
        // ...
    }
    finally {
        await browser.close();
    }
}
```

## demos • puppeteer_eval

```javascript
#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const puppeteer = require('puppeteer');
const puppeteer_eval = require('@vbarbarosh/puppeteer-helpers/src/puppeteer_eval');
const {performance} = require('perf_hooks');

const items = [
    {
        url: 'https://www.bnm.md',
        expr: `{
            usd: [
                (+document.querySelector('#ajax-wrapper-list > div > ul > li:nth-child(1) > span.rate')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('#ajax-wrapper-list > div > ul > li:nth-child(1) > span.rate')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
            eur: [
                (+document.querySelector('#ajax-wrapper-list > div > ul > li:nth-child(2) > span.rate')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('#ajax-wrapper-list > div > ul > li:nth-child(2) > span.rate')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
        }`
    },
    {
        url: 'https://www.xe.com/currencyconverter/convert/?Amount=1&From=MDL&To=USD',
        expr: `
            document.querySelector('#siteHeader svg').parentElement.click(),
            await waitForSelector('#inverse'),
            document.querySelector('#inverse').click(),
            await waitForSelector('[data-key=USD] .ellipser'), {
            usd: [
                (parseFloat(document.querySelector('[data-key=USD] .ellipser')?.textContent).toFixed(2)||null),
                (parseFloat(document.querySelector('[data-key=USD] .ellipser')?.textContent).toFixed(2)||null),
            ],
            eur: [
                (parseFloat(document.querySelector('[data-key=EUR] .ellipser')?.textContent).toFixed(2)||null),
                (parseFloat(document.querySelector('[data-key=EUR] .ellipser')?.textContent).toFixed(2)||null),
            ],
        }`,
    },
    {
        url: 'https://comertbank.md',
        expr: `{
            usd: [
                (+document.querySelector('div.vault.v_banka > div:nth-child(2) > div:nth-child(2)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('div.vault.v_banka > div:nth-child(3) > div:nth-child(2)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
            eur: [
                (+document.querySelector('div.vault.v_banka > div:nth-child(2) > div:nth-child(3)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('div.vault.v_banka > div:nth-child(3) > div:nth-child(3)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
        }`,
    },
    {
        url: 'https://fincombank.com',
        expr: `{
            usd: [
                (+document.querySelector('table.exchange-rates__table.active > tbody > tr:nth-child(1) > td:nth-child(2)')?.textContent||0).toFixed(2),
                (+document.querySelector('table.exchange-rates__table.active > tbody > tr:nth-child(1) > td:nth-child(3)')?.textContent||0).toFixed(2),
            ],
            eur: [
                (+document.querySelector('table.exchange-rates__table.active > tbody > tr:nth-child(2) > td:nth-child(2)')?.textContent||0).toFixed(2),
                (+document.querySelector('table.exchange-rates__table.active > tbody > tr:nth-child(2) > td:nth-child(3)')?.textContent||0).toFixed(2),
            ],
        }`,
    },
    {
        url: 'https://www.maib.md/ru',
        expr: `{
            usd: [
                (+document.querySelector('.exchange__table tbody tr:nth-child(1) td:nth-child(2)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('.exchange__table tbody tr:nth-child(1) td:nth-child(3)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
            eur: [
                (+document.querySelector('.exchange__table tbody tr:nth-child(2) td:nth-child(2)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('.exchange__table tbody tr:nth-child(2) td:nth-child(3)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
        }`,
    },
    {
        url: 'https://www.victoriabank.md/ru/kurs-obmena',
        expr: `{
            usd: [
                (+document.querySelector('#numerar > div.vb-table.vb-table-default.text-center > div:nth-child(2) > div:nth-child(2)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('#numerar > div.vb-table.vb-table-default.text-center > div:nth-child(2) > div:nth-child(3)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
            eur: [
                (+document.querySelector('#numerar > div.vb-table.vb-table-default.text-center > div:nth-child(3) > div:nth-child(2)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('#numerar > div.vb-table.vb-table-default.text-center > div:nth-child(3) > div:nth-child(3)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
        }`,
    },
    {
        url: 'https://micb.md',
        expr: `{
            usd: [
                (+document.querySelector('#currancy-rates > table > tbody > tr:nth-child(1) > td:nth-child(2)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('#currancy-rates > table > tbody > tr:nth-child(1) > td:nth-child(3)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
            eur: [
                (+document.querySelector('#currancy-rates > table > tbody > tr:nth-child(2) > td:nth-child(2)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('#currancy-rates > table > tbody > tr:nth-child(2) > td:nth-child(3)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
        }`,
    },
    {
        url: 'https://ecb.md',
        expr: `{
            usd: [
                (+document.querySelector('.curr-list > .sector-1 > :nth-child(2)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('.curr-list > .sector-1 > :nth-child(3)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
            eur: [
                (+document.querySelector('.curr-list > .sector-1 > :nth-child(6)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
                (+document.querySelector('.curr-list > .sector-1 > :nth-child(7)')?.textContent||0).toFixed(2).replace(/^0.00$/, '')||null,
            ],
        }`,
    },
];

cli(main);

async function main()
{
    // net::ERR_CERT_DATE_INVALID at http://eximbank.com
    const browser = await puppeteer.launch({ignoreHTTPSErrors: true, headless: 'new'});
    try {
        const results = await Promise.map(items, mapper, {concurrency: 10});
        async function mapper(item) {
            const begin = performance.now();
            const page = await browser.newPage();
            // https://comertbank.md/ returns 404 for HeadlessChrome
            // Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/92.0.4512.0 Safari/537.36
            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4512.0 Safari/537.36');
            await page.exposeFunction('waitForSelector', async function (selector) {
                await page.waitForSelector(selector);
            });
            try {
                console.log(`begin: ${item.url}`);
                await page.goto(item.url);
                const out = {url: item.url, ...await puppeteer_eval(page, item.expr)};
                const time = `${+((performance.now() - begin)/1000).toFixed(2)}sec`;
                console.log(`done: ${item.url} [${time}]`);
                out.time = time;
                return out;
            }
            catch (error) {
                console.log(`Parse failed with message: ${error.message}`, item);
                const time = `${+((performance.now() - begin)/1000).toFixed(2)}sec`;
                return {url: item.url, time, error, usd: ['', ''], eur: ['', '']};
            }
            finally {
                await page.close();
            }
        }
        const table = results.map(v => [v.url, ...v.usd, ...v.eur, v.time]);
        table.sort((b,a) => a[1] - b[1]);
        console.log();
        console.log(render_table(table));
    }
    catch (error) {
        console.log(error.message);
    }
    finally {
        await browser.close();
    }
}

function render_table(array)
{
    const len = {};
    array.forEach(function (row) {
        row.forEach(function (value, i) {
            len[i] = Math.max(len[i]||0, String(value).length);
        });
    });
    let out = '';
    array.forEach(function (row) {
        out += row.map((v,i) => String(v).padEnd(len[i])).join(' | ').replace(/\s*$/, '\n');
    });
    return out;
}
```

```text
begin: https://www.bnm.md
begin: https://comertbank.md
begin: https://fincombank.com
begin: https://www.maib.md/ru
begin: https://www.victoriabank.md/ru/kurs-obmena
begin: https://www.xe.com/currencyconverter/convert/?Amount=1&From=MDL&To=USD
begin: https://ecb.md
begin: https://micb.md
done: https://ecb.md [3.06sec]
done: https://micb.md [3.77sec]
done: https://www.bnm.md [4.06sec]
done: https://www.victoriabank.md/ru/kurs-obmena [4.61sec]
done: https://www.xe.com/currencyconverter/convert/?Amount=1&From=MDL&To=USD [4.86sec]
done: https://www.maib.md/ru [5.37sec]
done: https://fincombank.com [6.16sec]
done: https://comertbank.md [6.89sec]

https://www.bnm.md                                                     | 17.93 | 17.93 | 19.46 | 19.46 | 4.06sec
https://comertbank.md                                                  | 17.85 | 18.00 | 19.25 | 19.50 | 6.89sec
https://fincombank.com                                                 | 17.83 | 18.03 | 19.28 | 19.52 | 6.16sec
https://www.maib.md/ru                                                 | 17.83 | 18.05 | 19.28 | 19.55 | 5.37sec
https://ecb.md                                                         | 17.82 | 18.02 | 19.26 | 19.52 | 3.06sec
https://www.xe.com/currencyconverter/convert/?Amount=1&From=MDL&To=USD | 17.81 | 17.81 | 19.30 | 19.30 | 4.86sec
https://www.victoriabank.md/ru/kurs-obmena                             | 17.75 | 18.03 | 19.20 | 19.49 | 4.61sec
https://micb.md                                                        | 17.75 | 18.05 | 19.20 | 19.55 | 3.77sec
```

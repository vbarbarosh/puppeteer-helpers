#!/usr/bin/env -S node -r esm

import cli from '@vbarbarosh/node-cli';
import puppeteer from 'puppeteer';
import puppeteer_log2 from '../../src/puppeteer_log2';

cli(main);

async function main()
{
    const url = 'https://login.tonies.com/legals/terms-of-service';

    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();
        puppeteer_log2(page);

        // https://github.com/puppeteer/puppeteer/issues/7475#issuecomment-894239401
        // > This issue doesn't occur when caching is disabled via await
        // > page.setCacheEnabled(false)
        //
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1196004
        // > # [DevTools] Request interception and caching may trigger double
        // > pause on stylesheet-initiated font requests in some conditions
        await page.setCacheEnabled(false);
        await page.setRequestInterception(true);
        page.on('request', req => req.continue());

        await page.goto(url, {waitUntil: 'networkidle0'});
    }
    finally {
        if (browser.isConnected()) {
            await browser.close()
        }
    }
}
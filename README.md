Print logs from puppeteer

## Installation

```shell
npm i vbarbarosh/puppeteer-log
```

## Basic usage

```javascript
#!/usr/bin/env node

import cli from '@vbarbarosh/node-cli';
import puppeteer from 'puppeteer';
import puppeteer_log from '@vbarbarosh/puppeteer-log';

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
        browser.close();
    }
}
```

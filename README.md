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

async function puppeteer_abort_images(page)
{
    await page.setRequestInterception(true);
    page.on('request', function (request) {
        if (request.resourceType() == 'image') {
            request.abort();
        }
        else {
            request.continue();
        }
    });
}

module.exports = puppeteer_abort_images;

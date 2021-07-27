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

export default puppeteer_abort_images;

/**
 * Evaluate javascript and return the results.
 *
 * Allows the following expressions:
 * - new Promise(resolve => setTimeout(resolve.bind(null, 1), 100))
 * - {foo: 1}
 * - {foo: await new Promise(resolve => setTimeout(resolve.bind(null, 1), 100))}
 * - function () { ... }
 * - async function () { ... }
 *
 * @param page
 * @param javascript
 * @returns {string}
 */
async function puppeteer_eval(page, javascript)
{
    return await page.evaluate(`(async function () {
        const out = (${javascript});
        return (typeof out == 'function') ? out() : out;
    })()`);
}

export default puppeteer_eval;

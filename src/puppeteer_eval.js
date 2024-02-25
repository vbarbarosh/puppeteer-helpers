/**
 * Evaluate javascript and return evaluated result.
 *
 * Allows the following expressions:
 * - new Promise(resolve => setTimeout(() => resolve(12345), 1))
 * - {foo: 12345}
 * - {foo: await new Promise(resolve => setTimeout(() => resolve(12345), 1))}
 * - function () { return 12345; }
 * - async function () { await new Promise(resolve => setTimeout(resolve, 1)); return 12345; }
 */
async function puppeteer_eval(page, javascript)
{
    return page.evaluate(`(async function () {
        const out = (${javascript});
        return (typeof out == 'function') ? out() : out;
    })()`);
}

module.exports = puppeteer_eval;

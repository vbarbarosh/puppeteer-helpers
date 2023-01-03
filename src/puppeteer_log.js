const Promise = require('bluebird');
const json_stringify_safe = require('json-stringify-safe');

/**
 *
 * @deprecated Deprecated in favor of puppeteer_log2
 * @param page
 * @param log
 * @return {*}
 */
function puppeteer_log(page, log = null)
{
    if (!log) {
        log = function log(message) {
            console.log(message);
        };
    }

    page.on('close', async function () {
        log('[puppeteer_close]');
    });
    page.on('console', async function (message) {
        const strings = await Promise.all(message.args().map(v => v.jsonValue().then(stringify, e => `ERR:${json_stringify_safe(e)}`)));
        log(`[puppeteer_console_${message.type()}] ${strings.join(' ')}`);
        function stringify(value) {
            return typeof value == 'object' ? json_stringify_safe(value) : value;
        }
    });
    page.on('dialog', function () {
        log('[puppeteer_dialog]');
    });
    page.on('domcontentloaded', function () {
        log('[puppeteer_domcontentloaded]');
    });
    page.on('error', function () {
        log('[puppeteer_error]');
    });
    page.on('frameattached', function () {
        log('[puppeteer_frameattached]');
    });
    page.on('framedetached', function () {
        log('[puppeteer_framedetached]');
    });
    page.on('framenavigated', function () {
        log('[puppeteer_framenavigated]');
    });
    page.on('load', function () {
        log('[puppeteer_load]');
    });
    page.on('metrics', function () {
        log('[puppeteer_metrics]');
    });
    page.on('pageerror', function (error) {
        log(`[puppeteer_pageerror] ${json_stringify_safe(error.message)}`);
    });
    page.on('request', async function (request) {
        log(`[puppeteer_request] ${request.method()} ${request.url()} ${JSON.stringify(request.headers())}`);
    });
    page.on('requestfailed', async function (request) {
        log(`[puppeteer_requestfailed] ${request.method()} ${request.url()} ${(request.failure()||{}).errorText||'n/a'}`);
    });
    page.on('requestfinished', async function () {
        log('[puppeteer_requestfinished]');
    });
    page.on('response', async function (response) {
        const request = response.request();
        log(`[puppeteer_response] ${response.status()} ${request.method()} ${request.url()}`);
    });

    return page;
}

module.exports = puppeteer_log;

const Promise = require('bluebird');
const json_stringify_safe = require('json-stringify-safe');

function puppeteer_log2(page, log = s => console.log(`[${new Date().toJSON()}]${s}`))
{
    // https://pptr.dev/#?product=Puppeteer&version=v10.2.0&show=api-class-page
    const listeners = {
        close: function () {
            log('[puppeteer_close]');
        },
        console: async function (message) {
            const strings = await Promise.all(message.args().map(v => v.jsonValue().then(stringify, e => `ERR:${json_stringify_safe(e)}`)));
            log(`[puppeteer_console_${message.type()}] ${strings.join(' ')}`);
            function stringify(value) {
                return typeof value == 'object' ? json_stringify_safe(value) : value;
            }
        },
        dialog: function () {
            log('[puppeteer_dialog]');
        },
        domcontentloaded: function () {
            log('[puppeteer_domcontentloaded]');
        },
        error: function (error) {
            log(`[puppeteer_error] ${json_stringify_safe(error)}`);
        },
        frameattached: function () {
            log('[puppeteer_frameattached]');
        },
        framedetached: function () {
            log('[puppeteer_framedetached]');
        },
        framenavigated: function () {
            log('[puppeteer_framenavigated]');
        },
        load: function () {
            log('[puppeteer_load]');
        },
        metrics: function () {
            log('[puppeteer_metrics]');
        },
        pageerror: function (error) {
            log(`[puppeteer_pageerror] ${json_stringify_safe(error)}`);
        },
        popup: function () {
            log('[puppeteer_popup]');
        },
        request: function (request) {
            log(`[puppeteer_request] ${request.method()} ${request.url()} ${json_stringify_safe(request.headers())}`);
        },
        requestfailed: function (request) {
            log(`[puppeteer_requestfailed] ${request.method()} ${request.url()} ${json_stringify_safe(request.failure())}`);
        },
        requestfinished: function (request) {
            log(`[puppeteer_requestfinished] ${request.method()} ${request.url()}`);
        },
        response: function (response) {
            log(`[puppeteer_response] ${response.status()} ${response.request().method()} ${response.url()} ${json_stringify_safe(response.headers())}`);
        },
        workercreated: function () {
            log('[puppeteer_workercreated]');
        },
        workerdestroyed: function () {
            log('[puppeteer_workerdestroyed]');
        },
    };

    Object.keys(listeners).forEach(key => page.on(key, listeners[key]));
    return {off};

    function off() {
        Object.keys(listeners).forEach(key => page.off(key, listeners[key]));
    }
}

module.exports = puppeteer_log2;

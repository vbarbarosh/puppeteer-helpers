It seems that the image was requested only once.

    bin/cli-size http://localhost/puppeteer-helpers/demos/double-load/

    [puppeteer_request] GET http://localhost/puppeteer-helpers/demos/double-load/ {"upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/92.0.4512.0 Safari/537.36"}
    [puppeteer_response] 200 GET http://localhost/puppeteer-helpers/demos/double-load/
    [puppeteer_framenavigated]
    [puppeteer_requestfinished]
    [puppeteer_request] GET https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&q=80 {"sec-ch-ua":"","referer":"http://localhost/","sec-ch-ua-mobile":"?0","user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/92.0.4512.0 Safari/537.36"}
    [puppeteer_domcontentloaded]
    [puppeteer_response] 200 GET https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&q=80
    [puppeteer_requestfinished]
    [puppeteer_load]

    [
        {
            "requests": [
                {
                    "time": "2021-08-12T14:55:25.102Z",
                    "url": "http://localhost/puppeteer-helpers/demos/double-load/",
                    "method": "GET",
                    "headers": {
                        "upgrade-insecure-requests": "1",
                        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/92.0.4512.0 Safari/537.36"
                    },
                    "failure": null,
                    "resource_type": "document"
                }
            ],
            "response": {
                "time": "2021-08-12T14:55:25.136Z",
                "url": "http://localhost/puppeteer-helpers/demos/double-load/",
                "status": 200,
                "headers": {
                    "date": "Thu, 12 Aug 2021 14:55:25 GMT",
                    "server": "Apache/2.4.41 (Ubuntu)",
                    "last-modified": "Thu, 12 Aug 2021 14:55:15 GMT",
                    "etag": "\"65b-5c95dec2cc66f-gzip\"",
                    "accept-ranges": "bytes",
                    "vary": "Accept-Encoding",
                    "content-encoding": "gzip",
                    "content-length": "363",
                    "keep-alive": "timeout=5, max=100",
                    "connection": "Keep-Alive",
                    "content-type": "text/html"
                },
                "size": 1627,
                "size_gzip": 363
            },
            "error": null
        },
        {
            "requests": [
                {
                    "time": "2021-08-12T14:55:25.152Z",
                    "url": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&q=80",
                    "method": "GET",
                    "headers": {
                        "sec-ch-ua": "",
                        "referer": "http://localhost/",
                        "sec-ch-ua-mobile": "?0",
                        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/92.0.4512.0 Safari/537.36"
                    },
                    "failure": null,
                    "resource_type": "image"
                }
            ],
            "response": {
                "time": "2021-08-12T14:55:25.326Z",
                "url": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&q=80",
                "status": 200,
                "headers": {
                    "date": "Thu, 12 Aug 2021 14:55:25 GMT",
                    "x-content-type-options": "nosniff",
                    "last-modified": "Thu, 12 Aug 2021 14:54:54 GMT",
                    "server": "imgix",
                    "age": "31",
                    "x-cache": "MISS, HIT",
                    "content-type": "image/jpeg",
                    "access-control-allow-origin": "*",
                    "cache-control": "public, max-age=315360000",
                    "x-imgix-id": "f0c4c73366d8a60625a03c87db28bf454957de56",
                    "accept-ranges": "bytes",
                    "content-length": "19191",
                    "cross-origin-resource-policy": "cross-origin",
                    "x-served-by": "cache-sjc10051-SJC, cache-hhn4041-HHN"
                },
                "size": 19191,
                "size_gzip": 18571
            },
            "error": null
        }
    ]

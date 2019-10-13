# Headers API

This repository contains code for the API endpoint at https://averyharnish.com/api/v1/headers and is built with [Cloudflare Workers](https://workers.cloudflare.com) and deployed with [`wrangler`](https://github.com/cloudflare/wrangler).

## API Usage

This API accepts `GET` requests only.

### Search Parameters

| key    | value                                      | required |
| ------ | ------------------------------------------ | -------- |
| url    | the endpoint you'd like to see headers for | yes      |
| header | a specific header                          | no       |

### Response Format

The API will return a response with a content type of `application/json` which will include two fields: `data` and `error`. `data` will be an object, and error will be a string.

## Examples

### Get all headers

```console
$ curl -s https://averyharnish.com/api/v1/headers?url=example.com | jq
{
  "data": {
    "cache-control": "max-age=604800",
    "cf-cache-status": "DYNAMIC",
    "cf-ray": "524ef2bd37169b0c-DFW",
    "connection": "keep-alive",
    "content-type": "text/html; charset=UTF-8",
    "date": "Sun, 13 Oct 2019 05:35:05 GMT",
    "expect-ct": "max-age=604800, report-uri=\"https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct\"",
    "expires": "Sun, 20 Oct 2019 05:35:05 GMT",
    "last-modified": "Fri, 09 Aug 2013 23:54:35 GMT",
    "server": "cloudflare",
    "x-cache": "HIT"
  },
  "error": ""
}
```

### Get a single header

```console
$ curl -s https://averyharnish.com/api/v1/headers\?url\=example.com\&header\=content-type | jq
{
  "data": {
    "content-type": "text/html; charset=UTF-8"
  },
  "error": ""
}
```

#### Bugs?

Seems like for some reason this API injects some Cloudflare-related headers into the response even for websites that don't use Cloudflare. Not quite sure what that's about.

If there are other bugs feel free to file an issue (or make a PR).

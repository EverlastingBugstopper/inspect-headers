const universalURL = require('universal-url')
global.URL = universalURL.URL
global.URLSearchParams = universalURL.URLSearchParams

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

Headers.prototype.toString = function headersToString() {
  return JSON.stringify(this.toJSON())
}

Headers.prototype.toJSON = function headersToJSON() {
  const map = new Map(this)
  let obj = {}
  for (let [key, value] of map) {
    obj[key] = value
  }
  return obj
}

function getURL() {
  if (!this.parsedURL) {
    this.parsedURL = new URL(this.url)
  }
  return this.parsedURL
}

Request.prototype.getURL = getURL
Response.prototype.getURL = getURL

function getAPIResponse(data, error = '', status = 200) {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  let result = {
    data: {},
    error: '',
  }
  if (data && !error) {
    result = {
      data,
      error: '',
    }
  } else if (!data && error) {
    status = 400
    result = {
      data: {},
      error,
    }
  } else {
    status = 500
    result = {
      data: {},
      error: 'An unknown error has occurred',
    }
  }
  return new Response(JSON.stringify(result), { status, headers })
}

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    let searchParams = request.getURL().searchParams
    let url = searchParams.get('url')
    let header = searchParams.get('header')
    if (!url) {
      let error =
        'No url specified. Requests must be formed as such: https://averyharnish.com/api/v1/headers?url=https://example.com&header=content-type'
      return getAPIResponse(null, error)
    } else {
      let parsedURL
      try {
        parsedURL = new URL(url)
      } catch (e) {
        try {
          parsedURL = new URL(`https://${url}`)
        } catch (e) {
          return getAPIResponse(null, `Could not parse url ${url}`, 400)
        }
      }
      url = parsedURL
    }
    let response = await fetch(url, { method: 'HEAD' })
    if (response.status != 200) {
      let error = `Response from ${url} returned non-200 status code ${request.status}`
      return getAPIResponse(null, error, 400)
    }
    let headers = response.headers.toJSON()
    if (!header) {
      return getAPIResponse(headers)
    }
    const headerValue = headers[header]
    if (typeof header !== 'undefined') {
      return getAPIResponse(JSON.parse(`{"${header}":"${headerValue}"}`))
    }
    return getAPIResponse(
      null,
      `${url} did not respond with header ${header}`,
      400,
    )
  } catch (e) {
    return getAPIResponse(null)
  }
}

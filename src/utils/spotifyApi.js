export function fetch(uri, options = {}) {
  if ('undefined' === typeof options.headers) options.headers = new Headers();
  if (null === options.headers.get('Accept'))
    options.headers.set('Accept', 'application/json');

  if (
    'undefined' !== options.body &&
    !(options.body instanceof FormData) &&
    null === options.headers.get('Content-Type')
  )
    options.headers.set('Content-Type', 'MIME_TYPE');

  return global.fetch(new URL(uri, process.env.REACT_APP_SPOTIFY_API_ENDPOINT), options)
    .then(response => {
      if (response.ok) return response;
      return response.json()
        .then(
          json => { if (json.error.message) throw new Error(json.error.message); },
          () => { throw new Error(response.statusText || 'An error occurred.'); }
        );
    });
}
/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
function createFetch(
  fetch,
  { baseUrl, cookie },
) {
  // NOTE: Tweak the default options to suite your application needs
  const defaults = {
    method: 'POST',
    mode: baseUrl ? 'cors' : 'same-origin',
    credentials: baseUrl ? 'include' : 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : null)
    }
  };

  return async (url, options) => fetch(`${baseUrl || ''}${url}`, {
    ...defaults,
    ...options,
    body: (options && options.body && JSON.stringify(options.body)) || null,
    headers: {
      ...defaults.headers,
      ...(options && options.headers)
    }
  });
}

export default createFetch;

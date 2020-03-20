/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

export default {
  client: {
    siteName: process.env.SITE_NAME,
    domain: __DEV__ ? 'https://localhost' : process.env.DOMAIN,
    ogImage: `${__DEV__ ? 'https://localhost' : process.env.DOMAIN}${process.env.OG_IMAGE}`,
    reCAPTCHASiteKey: process.env.RECAPTCHA_SITE_KEY,
  },
  server: {
    port: process.env.PORT || 5001,
    // https://expressjs.com/en/guide/behind-proxies.html
    trustProxy: process.env.TRUST_PROXY || 'loopback',

    // API Gateway
    api: {
      // API URL to be used in the client-side code
      clientUrl: process.env.API_CLIENT_URL || '',
      // API URL to be used in the server-side code
      serverUrl:
        process.env.API_SERVER_URL
        || `http://localhost:${process.env.PORT || 5000}`,

      apiUrl: __PROD__
        ? process.env.API_URL
        : process.env.DEV_API_URL || 'https://localhost/',
    },
  },

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  // Authentication
  auth: {
    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '186244551745631',
      secret:
        process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
    },

    // https://cloud.google.com/console/project
    google: {
      id:
        process.env.GOOGLE_CLIENT_ID
        || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
    },
  },
};

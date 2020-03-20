export default (siteKey, callback, action) => new Promise((resolve, reject) => {
  if (!siteKey || !callback) {
    return;
  }
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  script.addEventListener('load', () => {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action }).then((token) => {
        if (typeof callback !== 'undefined') {
          callback(token);
        }
      });
    });
    resolve();
  });
  script.addEventListener('error', (e) => {
    reject(e);
  });
  document.body.appendChild(script);
});

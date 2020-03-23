import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import logger from 'esther';
import StyleContext from 'isomorphic-style-loader/StyleContext';

import config from '../config';

import Html from '../app/components/Html';
import NotFound from '../app/pages/not-found/NotFound';
import ErrorPage from '../app/pages/error/ErrorPage';


// Error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

function Provider(component, css) {
  return (
    <StyleContext.Provider value={{
      insertCss: (...styles) => styles.forEach(style => css.add(style._getCss()))
    }}
    >
      {component}
    </StyleContext.Provider>
  );
}

// eslint-disable-next-line no-unused-vars
export default function pageErrorHandler(err, req, res, next) {
  logger.error(__PROD__ ? err : pe.render(err));
  let page = null;

  if (__PROD__) {
    page = <NotFound />;
  }
  else {
    page = <ErrorPage error={err} />;
  }

  const data = {};
  // Set og tags
  data.domain = config.client.domain;
  data.ogImage = config.client.ogImage;
  data.siteName = config.client.siteName;
  data.url = req.originalUrl;
  const css = new Set();
  data.children = ReactDOM.renderToString(Provider(page, css));

  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="404 Not Found"
      description="404 Not Found"
      styles={[{ id: 'css', cssText: [...css].join('') }]} // eslint-disable-line no-underscore-dangle
      {...data}
      disableStore
    />
  );
  res.status(__PROD__ ? 404 : err.status || 500);
  res.send(`<!doctype html>${html}`);
}

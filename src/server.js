/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
import React from 'react';
import ReactDOM from 'react-dom/server';
import { Helmet } from 'react-helmet';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import helmet from 'helmet';
import logger from 'esther';
import dotenv from 'dotenv';
import csrf from 'csurf';

import router from './lib/router';
import Isomorphic from './lib/isomorphic';

import csrfHandler from './middleware/csrfHandler';
import morgan from './middleware/morgan';
import pageErrorHandler from './middleware/pageErrorHandler';
import oauth, { initService } from './middleware/oauth';

import Html from './app/components/Html';
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import config from './config';
// import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved

class Server {
  constructor() {
    dotenv.config();
    this.app = express();
    initService();
    this.attachMiddleware();
  }

  static async renderer(req, res, next) {
    try {
      // eslint-disable-next-line object-curly-newline
      const { path: pathname, query, headers, originalUrl } = req;
      const { cookie } = headers;
      const userAgent = headers['user-agent'].toLowerCase();
      const defaultLocale = headers['accept-language'];

      const isomorphic = new Isomorphic(Isomorphic.server, {
        path: pathname,
        originalUrl,
        query,
        cookie,
        userAgent,
        apiServerUrl: config.server.api.apiUrl,
        defaultLocale,
        state: {
          config: {
            csrf: req.csrfToken ? req.csrfToken() : null,
            challenge: req.login_challenge,
            reCAPTCHASiteKey: config.client.reCAPTCHASiteKey,
          },
          theme: config.theme,
        }
      });

      const { context } = isomorphic;
      const route = await router.resolve(context);

      if (route.redirect) {
        res.redirect(route.status || 302, route.redirect);
        return;
      }

      const data = { ...route };
      const { css } = isomorphic;
      data.children = ReactDOM.renderToString(
        isomorphic.provider(route.component)
      );

      // Set og tags
      data.domain = config.client.domain;
      data.ogImage = config.client.ogImage;
      data.siteName = config.client.siteName;
      data.url = originalUrl;

      const reactHelmet = Helmet.renderStatic();

      data.helmet = reactHelmet;
      data.styles = [{ id: 'css', cssText: [...css].join('') }];
      const scripts = new Set();
      const addChunk = (chunk) => {
        if (chunks[chunk]) {
          chunks[chunk].forEach(asset => scripts.add(asset));
        }
        else if (__DEV__) {
          throw new Error(`Chunk with name '${chunk}' cannot be found`);
        }
      };
      addChunk('client');
      if (route.chunk) addChunk(route.chunk);
      if (route.chunks) route.chunks.forEach(addChunk);

      data.scripts = Array.from(scripts);
      data.app = {
        ...context.store.getState(),
      };

      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(route.status || 200);
      res.send(`<!doctype html>${html}`);
    }
    catch (err) {
      next(err);
    }
  }

  attachMiddleware() {
    this.app.use(helmet());
    this.app.use(helmet.hidePoweredBy({ setTo: '' }));

    // If you are using proxy from external machine, you can set TRUST_PROXY env
    // Default is to trust proxy headers only from loopback interface.
    this.app.set('trust proxy', config.server.trustProxy);

    // Logs every request
    this.app.use(morgan);

    this.app.use(process.env.PUBLIC_URL || '/auth', express.static(path.resolve(__dirname, 'public')));
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(csrf({
      cookie: {
        key: '_t',
        // secure: __PROD__,
        httpOnly: true,
      },
    }));

    // // Register API middleware proxy
    // this.app.post('*', (req, res) => Proxy.web(req, res, {
    //   target: `${config.server.api.apiUrl}`
    // }));

    // O Auth Handlers
    this.app.use(oauth);

    // Register server-side rendering middlewareydr
    this.app.get('*', Server.renderer);

    this.app.use(csrfHandler);

    // Page Error Handling
    this.app.use(pageErrorHandler);
  }

  listen() {
    // Launch the server
    if (!module.hot) {
      this.app.listen(config.server.port, () => {
        logger.info(`Showcase listening on ${config.server.port}`);
        logger.info(`Running ${process.env.NODE_ENV}`);
      });
    }

    // Hot Module Replacement
    if (module.hot) {
      this.hot = module.hot;
      module.hot.accept('./lib/router');
    }
  }
}

export default Server;

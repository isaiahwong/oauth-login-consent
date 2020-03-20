/* eslint-disable class-methods-use-this */
import React from 'react';
import { Provider } from 'react-redux';
import nodeFetch from 'node-fetch';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { InternalServerError } from 'horeb';

import { isMobile } from './userAgent';

import i18n, { setupLanguage } from '../common/i18n';
import createFetch from '../common/createFetch';
import history from '../app/history';
import App from '../app/components/App';
import configureStore from '../app/store/configureStore';

class ServerConfig {
  /**
   * @param {Object} options
   * @param {Object} options.defaultLocale
   * @param {Object} options.userAgent
   * @param {Object} options.cookie
   * @param {Object} options.query
   * @param {Object} options.originalUrl
   * @param {Object} options.apiServerUrl
   * @param {Object} options.i18n
   */
  constructor({
    defaultLocale,
    userAgent,
    cookie,
    path,
    query,
    state,
    originalUrl,
    apiServerUrl
  }) {
    if (process.env.BROWSER) {
      throw new InternalServerError('Server code should not be executed on the browser');
    }

    setupLanguage({ defaultLocale });

    // Universal HTTP client
    this.fetch = createFetch(nodeFetch, {
      baseUrl: apiServerUrl,
      cookie,
    });

    this.css = new Set();
    this.userAgent = userAgent;
    this.cookie = cookie;
    this.path = path;
    this.query = query;

    const { controls } = this;

    if (isMobile(userAgent)) {
      controls.showNav = false;
      controls.desktopMode = false;
      controls.userAgentMobile = true;
    }

    this.initialState = {
      ...state,
      history: {
        pathname: originalUrl
      },
      controls,
      localization: {
        translations: i18n.translations,
        defaultLocale
      }
    };

    this.configureStore();
    this.createContext();

    this.insertCss = this.insertCss.bind(this);
  }

  get controls() {
    return {
      showNav: true,
      desktopMode: true,
      userAgentMobile: false,
    };
  }

  configureStore() {
    this.store = configureStore(this.initialState, {
      fetch: this.fetch,
    });
  }


  createContext() {
    if (!this.store) this.configureStore();
    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    this.context = {
      fetch: this.fetch,
      // The twins below are wild, be careful!
      pathname: this.path,
      query: this.query,
      store: this.store,
      storeSubscription: null,
    };
  }

  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss(...styles) {
    styles.forEach(style => this.css.add(style._getCss()));
  }
}

class ClientConfig {
  constructor() {
    if (!process.env.BROWSER) {
      throw new InternalServerError('Client code should only be executed on the browser');
    }
    this.configureStore();
    this.createContext();
    const { translations, defaultLocale } = this.store.getState().localization;

    setupLanguage({
      defaultLocale,
      translations
    });
  }

  configureStore() {
    this.store = configureStore(window.a, { history });
    // Deletes any form of state embedded on the DOM
    const dataStore = document.querySelector('[data-store]');
    while (dataStore.firstChild) {
      dataStore.removeChild(dataStore.firstChild);
    }
    // Clears data sent to client after interpolation
    delete window.a;
  }

  createContext() {
    if (!this.store) this.configureStore();
    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    this.context = {
      // Universal HTTP client
      fetch: createFetch(fetch, {
        baseUrl: null,
      }),
      store: this.store,
      storeSubscription: null,
    };
  }

  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss(...styles) {
    const removeCss = styles.map(x => x._insertCss());
    return () => {
      removeCss.forEach(f => f());
    };
  }
}

class Isomorphic {
  /**
   *
   * @param {String} target Isomorphic client or server
   * @param {Object} options
   * @param {Object} options.defaultLocale
   * @param {Object} options.userAgent
   * @param {Object} options.cookie
   * @param {Object} options.query
   * @param {Object} options.originalUrl
   */
  constructor(target, options) {
    let instance;
    switch (target) {
      case Isomorphic.client:
        instance = new ClientConfig(options);
        break;
      case Isomorphic.server:
        instance = new ServerConfig(options);
        break;
      default:
        throw new InternalServerError('Invalid Isomorphic target');
    }
    this._css = instance.css;
    this._insertCss = instance.insertCss;
    this._store = instance.store;
    this._context = instance.context;
    this._target = target;
    this.env = {

    };
  }

  static client = 'client';

  static server = 'server';

  get context() {
    return this._context;
  }

  get css() {
    return this._css;
  }

  set context(context) {
    this._context = context;
  }

  set css(css) {
    this._css = css;
  }

  provider(component) {
    return (
      <Provider store={this._store}>
        <StyleContext.Provider value={{ insertCss: this._insertCss }}>
          <App context={this._context}>{component}</App>
        </StyleContext.Provider>
      </Provider>
    );
  }
}

export default Isomorphic;

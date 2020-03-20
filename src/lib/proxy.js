import HttpProxy from 'http-proxy';
import { NotFound } from 'horeb';

import errorHandler from '../middleware/errorHandler';

class Proxy {
  constructor() {
    this.serverInterface = HttpProxy.createProxyServer({
      preserveHeaderKeyCase: true,
      ws: true,
      secure: !__DEV__,
    });

    // eslint-disable-next-line no-underscore-dangle
    this._onError();
  }

  _getEventNames() {
    return this.serverInterface.eventNames();
  }

  /**
   * Handles Not found route with errorHandler middleware
   */
  _onError() {
    this.serverInterface.on('error', (err, req, res, next) => {
      if (err.code === 'ENOTFOUND') {
        // eslint-disable-next-line no-param-reassign
        err = new NotFound();
      }

      errorHandler(err, req, res, next);
    });
  }

  web(req, res, options) {
    this.serverInterface.web(req, res, options);
  }
}

export default new Proxy();

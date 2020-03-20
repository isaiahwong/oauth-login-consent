
// load env variables
require('./lib/setupEnv').default();

const path = require('path');
const logger = require('esther');
const Server = require('./server').default;
const pkg = require('../package.json');

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection at: ${reason} ${reason.stack}`);
  // send entire app down. k8s will restart it
  process.exit(1);
});

// initialise logger
logger.init({
  useFileTransport: true,
  logDirectory: path.join(__dirname, '..', 'logs'),
  disableStackTrace: true,
  disableBrowser: true,
  useStackDriver: process.env.ENABLE_STACKDRIVER === 'true',
  stackDriverOpt: {
    serviceName: 'kinddd.showcase:client',
    ver: pkg.version
  }
});

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const server = new Server();
server.listen();

export default server;

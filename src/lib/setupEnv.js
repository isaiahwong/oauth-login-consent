/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */
import path from 'path';

export default function setupEnv(pathUrl = path.join(__dirname, '.env')) {
  // Initialise Environment Variable
  if (__DEV__) {
    pathUrl = path.join(__dirname, '..', '.env');
  }
  require('dotenv').config({ path: pathUrl });

  global['__PROD__'] = process.env.NODE_ENV === 'production';
  global['__DEV__'] = process.env.NODE_ENV === 'development';
  global['__TEST__'] = process.env.NODE_ENV === 'test';
}

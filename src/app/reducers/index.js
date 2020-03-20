import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import config from './config';
import controls from './controls';
import history from './history';
import network from './network';
import localization from './localization';

export default combineReducers({
  form: formReducer,
  localization,
  config,
  controls,
  network,
  history,
});

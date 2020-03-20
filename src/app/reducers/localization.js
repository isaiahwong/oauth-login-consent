import { ActionTypes } from '../actions/localization';

const initialState = {
  translations: {},
  defaultLocale: 'en'
};

export default function localization(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_LOCALE:
      return Object.assign({}, state, {
        defaultLocale: action.payload.locale,
      });

    default:
      return state;
  }
}

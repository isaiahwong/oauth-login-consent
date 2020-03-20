import { ActionTypes } from '../actions/controls';

const initialState = {
  showNav: true,
  desktopMode: true,
  userAgentMobile: false,
};

export default function controls(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_NAVIGATION:
      return Object.assign({}, state, {
        showNav: action.payload.showNav,
      });

    case ActionTypes.TOGGLE_DESKTOP:
      return Object.assign({}, state, {
        desktopMode: action.payload.desktopMode,
      });
    default:
      return state;
  }
}

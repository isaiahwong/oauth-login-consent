import { ActionTypes } from '../actions/config';

const initialState = {
  isFetching: false,
  csrf: '',
  challenge: '',
  reCAPTCHASiteKey: '',
  captchaResponse: ''
};

export default function config(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_CAPTCHA:
      return Object.assign({}, state, {
        captchaResponse: action.payload.captchaResponse,
      });
    default:
      return state;
  }
}

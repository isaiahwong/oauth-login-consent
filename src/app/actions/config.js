/* eslint-disable import/prefer-default-export */
import { createAction } from './utils/helper';

export const ActionTypes = {
  RECEIVE_CAPTCHA: 'RECEIVE_CAPTCHA',
};

export function receiveCaptcha(token) {
  return createAction(ActionTypes.RECEIVE_CAPTCHA, { captchaResponse: token });
}

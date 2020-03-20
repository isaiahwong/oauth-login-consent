/* eslint-disable import/prefer-default-export */
import { createAction, createActionApi } from './utils/helper';

export const ActionTypes = {
  REQUEST_USER: 'REQUEST_USER',
  RECEIVE_USER: 'RECEIVE_USER',
  REQUEST_SIGNUP: 'REQUEST_SIGNUP',
  REQUEST_SIGNIN: 'REQUEST_SIGNIN'
};

function receiveUser(user) {
  return createAction(ActionTypes.RECEIVE_USER, { user });
}

export function requestSignIn(params) {
  return createActionApi(ActionTypes.REQUEST_SIGNIN, {
    url: '/v1/auth/signin',
    params,
    onSuccess(result, dispatch) {
      dispatch(receiveUser(result.d));
    }
  });
}

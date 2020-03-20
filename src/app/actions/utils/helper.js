/* eslint-disable import/prefer-default-export */
import createFetch from '../../../common/createFetch';
import { setRequestInProcess, setRequestError } from '../network';

/**
 * Helper method that formats actions for the reducer
 * @param  {action} action The action type
 * @param  {payload} payload
 * @return {object}  Formatted action for the reducer to handle
 */
export function actionFormatter(action, payload) {
  return { type: action, payload };
}

/**
 * Action helper wrapper function.
 * Exclude or set requestType, api to null when executing
 * non-api requests; internal actions
 * @param {ActionType} actionType Redux Action Type
 * @param {*} payload  Parameters
 * @param {Object} options
 * @param {Function} options.beforeAction
 */
export function createAction(actionType, payload = null, options = {}) {
  if (!actionType) {
    throw new Error('actionType undefined');
  }

  const { beforeAction } = options;

  return (dispatch, getState) => {
    if (typeof beforeAction === 'function') {
      beforeAction(dispatch, getState);
    }
    return dispatch(actionFormatter(actionType, payload));
  };
}

/**
 * Action helper wrapper function.
 * Exclude or set requestType, api to null when executing
 * non-api requests; internal actions
 * @param {ActionType} actionType Redux Action Type
 * @param {Object} options
 * @param {*} options.params  Parameters
 * @param {Function} options.beforeRequest
 * @param {String} options.url Api URL
 * @param {Function} options.onFailure Callback
 * @param {Function} options.onSuccess Callback
 */
export function createActionApi(actionType, options) {
  if (!actionType) {
    throw new Error('actionType undefined');
  }

  const {
    url,
    params,
    beforeRequest,
    onSuccess,
    onFailure,
  } = options;

  let { method } = options;

  if (!method) {
    method = 'POST';
  }

  // Returns non promise dispatch
  if (!url) {
    throw new Error('url undefined');
  }

  return async (dispatch, getState, helpers) => {
    let { fetch } = helpers;

    if (!fetch) {
      fetch = createFetch(fetch, {});
    }
    try {
      if (typeof beforeRequest === 'function') {
        await beforeRequest(dispatch, getState);
      }

      const requestInProcess = getState().network.requestInProcess[actionType];

      if (requestInProcess) {
        return null;
      }

      dispatch(setRequestInProcess(true, actionType));
      const res = await fetch(url, {
        body: params,
      });
      dispatch(setRequestInProcess(false, actionType));

      if (!res.ok) {
        if (typeof onFailure === 'function') return onFailure(dispatch, getState);
        return null;
      }

      const result = await res.json();

      dispatch(setRequestError(false, actionType, null));
      dispatch(actionFormatter(actionType, result));
      if (typeof onSuccess === 'function') {
        onSuccess(result, dispatch, getState, helpers);
      }
      return result;
    }
    catch (error) {
      // TODO: error handling
      return null;
    }
  };
}

import { createAction } from './utils/helper';

export const ActionTypes = {
  REQUEST_IN_PROCESS: 'REQUEST_IN_PROCESS',
  REQUEST_ERROR: 'REQUEST_ERROR',
};

export function setRequestInProcess(inProcess, requestType) {
  return createAction(ActionTypes.REQUEST_IN_PROCESS, {
    inProcess,
    requestType
  });
}

export function setRequestError(hasError, requestType, error) {
  return createAction(ActionTypes.REQUEST_ERROR, {
    requestType,
    hasError,
    error
  });
}

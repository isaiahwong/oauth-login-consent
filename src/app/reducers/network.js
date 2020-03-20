import { ActionTypes } from '../actions/network';

const initialState = {
  requestInProcess: {},
  requestError: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.REQUEST_IN_PROCESS: {
      const { inProcess, requestType } = action;
      return Object.assign({}, state, {
        requestInProcess: {
          ...state.requestInProcess,
          [requestType]: inProcess
        },
      });
    }

    case ActionTypes.REQUEST_ERROR: {
      const { hasError, requestType } = action;
      return Object.assign({}, state, {
        requestError: {
          ...state.requestError,
          [requestType]: { hasError, error: action.error }
        },
      });
    }

    default:
      return state;
  }
}

import { combineReducers } from 'redux';

export const searchStates = {
  LOADING: 'SEARCH_LOADING',
  RESULT: 'SEARCH_RESULT',
  ERROR: 'SEARCH_ERROR'
};

export function loading(state = null, action) {
  switch (action.type) {
    case searchStates.LOADING:
      return action.loading;
    default:
      return state;
  }
}

export function result(state = null, action) {
  switch (action.type) {
    case searchStates.RESULT:
      return action.result;
    default:
      return state;
  }
}

export function error(state = null, action) {
  switch (action.type) {
    case searchStates.ERROR:
      return action.error;
    default:
      return state;
  }
}

export default combineReducers({ loading, result, error });


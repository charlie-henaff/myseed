import { combineReducers } from 'redux';
import { snackBarSeverity } from './layout/snackBar';
import appState from '.';

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

export function error(state = {}, action) {
  switch (action.type) {
    case searchStates.ERROR:
      return {
        ...state,
        app: {
          ...state.app,
          layout: {
            ...state.app.layout,
            snackBar: {
              ...state.app.layout.snackBar,
              severity: snackBarSeverity.error,
              message: action.error,
              isOpen: true
            }
          },
          search: {
            ...state.app.search,
            error: action.error
          }
        }
      }
    default:
      return state;
  }
}

export default combineReducers({ loading, result, error });


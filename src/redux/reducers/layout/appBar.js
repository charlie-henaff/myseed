import {combineReducers} from 'redux';

export const appBarStates = {
  SEARCH: 'APP_BAR_SEARCH',
};

export function search(state = "", action) {
  switch (action.type) {
    case appBarStates.SEARCH:
      return action.search;

    default:
      return state;
  }
}

export default combineReducers({search});
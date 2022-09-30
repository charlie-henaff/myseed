import { combineReducers } from 'redux';

export const appBarStates = {
  SEARCH: 'APP_BAR_SEARCH',
  TITLE: 'APP_BAR_TITLE'
};

export function search(state = "", action) {
  switch (action.type) {
    case appBarStates.SEARCH:
      return action.search;

    default:
      return state;
  }
}

export function title(state = "", action) {
  switch (action.type) {
    case appBarStates.TITLE:
      return action.title;

    default:
      return state;
  }
}

export default combineReducers({search, title});
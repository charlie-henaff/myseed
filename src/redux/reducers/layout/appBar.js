import { combineReducers } from 'redux';

export const appBarStates = {
  SEARCH: 'APP_BAR_SEARCH',
  TITLE: 'APP_BAR_TITLE',
  RIGHT_COMPONENT: 'APP_BAR_RIGHT_COMPONENT'
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

export function rightComponent(state = null, action) {
    switch (action.type) {
      case appBarStates.RIGHT_COMPONENT:
        return action.rightComponent;
  
      default:
        return state;
    }
  }

export default combineReducers({search, title, rightComponent});
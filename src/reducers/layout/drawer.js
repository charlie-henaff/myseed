import {combineReducers} from 'redux';

export const drawerStates = {
  OPEN: 'DRAWER_OPEN_STATE',
};

export function open(state = false, action) {
  switch (action.type) {
    case drawerStates.OPEN:
      return action.open;
    default:
      return state;
  }
}

export default combineReducers({open});
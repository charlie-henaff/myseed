import { combineReducers } from 'redux';
import appBar from './appBar';
import drawer from './drawer';
import player from './player';
import snackBar from "./snackBar";

export const layoutStates = {
  VISIBLE: 'LAYOUT_VISIBLE_STATE',
  FULL_SIZE_CONTENT: 'FULL_SIZE_CONTENT',
};

export function visible(state = true, action) {
  switch (action.type) {
    case layoutStates.VISIBLE:
      return action.visible;
    default:
      return state;
  }
}

export function fullSizeContent(state = true, action) {
  switch (action.type) {
    case layoutStates.FULL_SIZE_CONTENT:
      return action.fullSizeContent;
    default:
      return state;
  }
}

export default combineReducers({ visible, fullSizeContent, appBar, drawer, snackBar, player });
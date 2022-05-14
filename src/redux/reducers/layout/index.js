import { combineReducers } from 'redux';
import appBar from './appBar';
import drawer from './drawer';
import snackBar from "./snackBar";

export const layoutStates = {
  VISIBLE: 'LAYOUT_VISIBLE_STATE',
  FULL_SIZE_CONTENT: 'FULL_SIZE_CONTENT',
  SPOTIFY_PLAYER_ACTIVE: 'SPOTIFY_PLAYER_ACTIVE'
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

export function spotifyPlayerActive(state = false, action) {
  switch (action.type) {
    case layoutStates.SPOTIFY_PLAYER_ACTIVE:
      return action.spotifyPlayerActive;
    default:
      return state;
  }
}

export default combineReducers({ visible, fullSizeContent, spotifyPlayerActive, appBar, drawer, snackBar });
import { combineReducers } from 'redux';

export const playlistStates = {
  LOADING: 'MUSIC_PLAYLIST_LOADING',
  RESULT: 'MUSIC_PLAYLIST_RESULT',
  ERROR: 'MUSIC_PLAYLIST_ERROR'
};

export function loading(state = null, action) {
  switch (action.type) {
    case playlistStates.LOADING:
      return action.loading;
    default:
      return state;
  }
}

export function result(state = null, action) {
  switch (action.type) {
    case playlistStates.RESULT:
      return action.result;
    default:
      return state;
  }
}

export function error(state = null, action) {
  switch (action.type) {
    case playlistStates.ERROR:
      return action.error;
    default:
      return state;
  }
}

export default combineReducers({ loading, result, error });


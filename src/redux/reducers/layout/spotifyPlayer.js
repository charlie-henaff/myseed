import { combineReducers } from 'redux';

export const spotifyPlayerState = {
    VISIBLE: 'LAYOUT_SPOTIFY_PLAYER_VISIBLE',
    URIS: 'LAYOUT_SPOTIFY_PLAYER_URIS'
};

export function visible(state = false, action) {
    switch (action.type) {
        case spotifyPlayerState.VISIBLE:
            return action.visible;
        default:
            return state;
    }
}

export function uris(state = [], action) {
    switch (action.type) {
        case spotifyPlayerState.URIS:
            return action.uris;
        default:
            return state;
    }
}

export default combineReducers({ visible, uris });
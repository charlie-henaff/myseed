import { combineReducers } from 'redux';

export const playerState = {
    VISIBLE: 'LAYOUT_PLAYER_VISIBLE',
    URIS: 'LAYOUT_PLAYER_URIS',
    PLAYING: 'LAYOUT_PLAYER_PLAYING'
};

export function visible(state = false, action) {
    switch (action.type) {
        case playerState.VISIBLE:
            return action.visible;
        default:
            return state;
    }
}

export function uris(state = [], action) {
    switch (action.type) {
        case playerState.URIS:
            return action.uris;
        default:
            return state;
    }
}

export function playing(state = null, action) {
    switch (action.type) {
        case playerState.PLAYING:
            return action.playing;
        default:
            return state;
    }
}

export default combineReducers({ visible, uris, playing});
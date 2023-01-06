import { combineReducers } from 'redux';

export const playerState = {
    VISIBLE: 'LAYOUT_PLAYER_VISIBLE',
    NEXT_URIS: 'LAYOUT_PLAYER_NEXT_URIS',
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

export function nextUris(state = [], action) {
    switch (action.type) {
        case playerState.URIS:
            return action.nextUris;
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

export default combineReducers({ visible, nextUris, playing });
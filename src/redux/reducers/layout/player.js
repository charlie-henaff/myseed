import { combineReducers } from 'redux';

export const playerState = {
    VISIBLE: 'LAYOUT_PLAYER_VISIBLE',
    NEXT_URIS: 'LAYOUT_PLAYER_NEXT_URIS',
    CURRENT_URI: 'LAYOUT_PLAYER_CURRENT_URI'
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
        case playerState.NEXT_URIS:
            return action.nextUris;
        default:
            return state;
    }
}

export function currentUri(state = null, action) {
    switch (action.type) {
        case playerState.CURRENT_URI:
            return action.currentUri;
        default:
            return state;
    }
}

export default combineReducers({ visible, nextUris, currentUri });
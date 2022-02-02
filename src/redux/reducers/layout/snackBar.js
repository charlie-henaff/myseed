import { combineReducers } from 'redux';
import { searchStates } from '../search';

export const snackBarSeverity = {
    default: 'default',
    info: 'info',
    success: 'success',
    error: 'error'
};

export const snackBarState = {
    severity: 'SNACKBAR_SEVERITY',
    message: 'SNACKBAR_MESSAGE',
    isOpen: 'SNACKBAR_IS_OPEN',
};

export function severity(state = null, action) {
    switch (action.type) {
        case snackBarState.severity:
            return action.severity;
        case searchStates.ERROR:
            return snackBarSeverity.error;
        default:
            return state;
    }
}

export function message(state = null, action) {
    switch (action.type) {
        case snackBarState.message:
            return action.message;
        case searchStates.ERROR:
            return action.error;
        default:
            return state;
    }
}

export function isOpen(state = false, action) {
    switch (action.type) {
        case snackBarState.isOpen:
            return action.isOpen;
        case searchStates.ERROR:    
            return true;
        default:
            return state;
    }
}

export default combineReducers({ severity, message, isOpen });
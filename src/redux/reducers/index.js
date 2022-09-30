import { combineReducers } from 'redux';
import layout from './layout/index';
import playlist from './playlist';
import search from './search';

export default combineReducers({layout, search, playlist});
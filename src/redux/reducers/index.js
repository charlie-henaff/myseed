import {combineReducers} from 'redux';
import layout from './layout/index';
import search from './search';
import music from './music/index'

export default combineReducers({layout, search, music});
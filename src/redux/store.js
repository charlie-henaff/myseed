import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {reducer as form} from 'redux-form';
import {connectRouter, routerMiddleware,} from 'connected-react-router';
import appState from './reducers';
import history from '../history';

const composeEnhancers = (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION__) || compose;

export default createStore(
    combineReducers({
      app: appState,
      router: connectRouter(history),
      form,
      composeEnhancers,
    }),
    applyMiddleware(routerMiddleware(history), thunk),
);
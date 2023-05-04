import { connectRouter, routerMiddleware } from 'connected-react-router';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as form } from 'redux-form';
import thunk from 'redux-thunk';
import history from '../history';
import appState from './reducers';

// const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export default createStore(
  combineReducers({
    app: appState,
    router: connectRouter(history),
    form,
  }),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
);
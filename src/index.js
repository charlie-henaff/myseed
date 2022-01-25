import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {reducer as form} from 'redux-form';
import {createBrowserHistory} from 'history';
import {ConnectedRouter, connectRouter, routerMiddleware,} from 'connected-react-router';
import * as serviceWorker from './serviceWorker';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import appState from './reducers';
import LayoutComponent from './components/Layout/Layout';

const composeEnhancers = (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION__) || compose;

export const APP_CONST = {
    LOCAL_STORAGE: {
        SPOTIFY_TOKEN: 'APP_CONST_LOCAL_STORAGE_SPOTIFY_TOKEN',
        SPOTIFY_REFRESH_TOKEN: 'APP_CONST_LOCAL_STORAGE_SPOTIFY_REFRESH_TOKEN',
    },
};

export const basePath = new URL(process.env.REACT_APP_BASE_URL).pathname;
console.log(basePath); // test
export const history = createBrowserHistory({basename: basePath});
export const store = createStore(
    combineReducers({
      app: appState,
      router: connectRouter(history),
      form,
      composeEnhancers,
    }),
    applyMiddleware(routerMiddleware(history), thunk),
);

ReactDOM.render(
  <Provider store={store}>
      <ConnectedRouter history={history}>
          <CssBaseline/>
          <ThemeProvider theme={theme}>
              <LayoutComponent/>
          </ThemeProvider>
      </ConnectedRouter>
  </Provider>,
    document.getElementById('root')
);

// If
// you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

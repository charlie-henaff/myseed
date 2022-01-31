import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import history from './history';
import * as serviceWorker from './serviceWorker';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import LayoutComponent from './components/Layout/Layout';
import store from './redux/store';
import { ConnectedRouter } from 'connected-react-router';

export const APP_CONST = {
    LOCAL_STORAGE: {
        SPOTIFY_TOKEN: 'APP_CONST_LOCAL_STORAGE_SPOTIFY_TOKEN',
        SPOTIFY_REFRESH_TOKEN: 'APP_CONST_LOCAL_STORAGE_SPOTIFY_REFRESH_TOKEN',
    },
};

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <LayoutComponent />
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

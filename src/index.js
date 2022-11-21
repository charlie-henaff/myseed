import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Install from './components/Install';
import LayoutComponent from './components/Layout/Layout';
import history from './history';
import store from './redux/store';
import * as serviceWorker from './serviceWorker';
import theme from './theme';

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <LayoutComponent />
                <Install/>
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

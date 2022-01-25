import { Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import React from 'react';
import Login from '../components/Login';
import Home from '../components/Home';
import SearchResult from '../components/SearchResult';
import { APP_CONST, basePath } from '../index';

function LoginCheckedRoute({ component: Component, authed, ...rest }) {
  const isLoggedIn = localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN);
  return (
    <Route
      {...rest}
      render={(props) => isLoggedIn
        ? <Component {...props} />
        : <Redirect to={{ pathname: basePath + '/login', state: { from: props.location } }} />}
    />
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  <Route path="/login" key="route_login" component={Login} />,
  <LoginCheckedRoute path="/" key="route_home" exact component={Home} />,
  <LoginCheckedRoute path="/search" key="route_search" component={SearchResult} />
];
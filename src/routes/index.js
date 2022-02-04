import { Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import React from 'react';
import Login from '../components/Login';
import Home from '../components/Home';
import SearchResult from '../components/Search';
import { APP_CONST } from '../index';

function LoginCheckedRoute({ component: Component, authed, ...rest }) {

  const now = new Date();
  const spotifyToken = localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN);
  const spotifyTokenExpirationDate = new Date(localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN_EXPIRATION_DATE));

  const isLoggedIn = spotifyToken && spotifyTokenExpirationDate && spotifyTokenExpirationDate > now;

  return (
    <Route
      {...rest}
      render={(props) => isLoggedIn
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  <Route path="/login" key="route_login" component={Login} />,
  <LoginCheckedRoute path="/" key="route_home" exact component={Home} />,
  <LoginCheckedRoute path="/search" key="route_search" component={SearchResult} />
];
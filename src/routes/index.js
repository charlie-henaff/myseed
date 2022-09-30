import React from 'react';
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Playlist from '../components/Playlist';
import SearchResult from '../components/Search';
import { logged } from '../services/LoginServices';

function LoginCheckedRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => logged()
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  <Route path="/login" key="route_login" component={Login} />,
  <LoginCheckedRoute path="/" key="route_home" exact component={Home} />,
  <LoginCheckedRoute path="/search" key="route_search" component={SearchResult} />,
  <LoginCheckedRoute path="/playlist" key="route_playlist" exact component={Playlist} />,
];
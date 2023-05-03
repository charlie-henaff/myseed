import { APP_CONST } from "../constants";

const spotify_client_scopes = 'streaming user-read-email user-read-private user-library-read user-library-modify user-top-read user-read-playback-state user-modify-playback-state';
const spotify_login_callback = process.env.REACT_APP_BASE_URL + '/login';

const MAX_NB_TRY = 3;

export const fetch = (uri, options = {}, currentTry = 0) => {
  if ('undefined' === typeof options.headers) options.headers = new Headers();

  if (null === options.headers.get('Authorization') && localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
    options.headers.set('Authorization', `Bearer ${localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)}`);
  }

  if (null === options.headers.get('Accept')) {
    options.headers.set('Accept', 'application/json');
  }

  if (
    'undefined' !== options.body &&
    !(options.body instanceof FormData) &&
    null === options.headers.get('Content-Type')
  ) {
    options.headers.set('Content-Type', 'MIME_TYPE');
  }

  // add current device_id parameter on all ../player/.. post or put request
  let currentDeviceId = localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID);
  if (currentDeviceId === "undefined") currentDeviceId = null;
  if (
    currentDeviceId != null &&
    options?.method != null &&
    ['post', 'put'].find(item => item === options.method.toLowerCase()) != null &&
    uri.includes("player") &&
    uri.split('/').pop() !== "player"
  ) {
    uri = uri + (uri.includes('?') ? '&' : '?') + 'device_id=' + currentDeviceId;
  }

  return global.fetch(new URL(process.env.REACT_APP_SPOTIFY_API_ENDPOINT + uri), options)
    .then(response => {
      if (response.status === 202) return true;
      if (response.status === 204) return '';
      if (response.status === 401) {
        options.headers.delete('Authorization');
        return refreshToken().then(() => fetch(uri, options));
      }
      if (response.status === 502 && currentTry < MAX_NB_TRY) return fetch(uri, options, ++currentTry);
      if (response.ok) return response.json();
      return response.json()
        .then(
          json => { if (json.error.message) throw new Error(json.error.message); },
          () => { throw new Error(response.statusText || 'An error occurred.'); }
        );
    });
}

export const auth = () => {
  window.location = 'https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.REACT_APP_SPOTIFY_CLIENT_ID +
    '&scope=' + encodeURIComponent(spotify_client_scopes) +
    '&redirect_uri=' + encodeURIComponent(spotify_login_callback) +
    '&show_dialog=true';
};

export const getToken = (code) => {

  const header = {
    'Authorization': `Basic ${btoa(`${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`)}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(spotify_login_callback)}`;

  return global.fetch('https://accounts.spotify.com/api/token', { method: 'post', headers: header, body: body })
    .then(response => response.json())
    .then(data => {
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + data.expires_in);
      localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN, data.access_token);
      localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN_EXPIRATION_DATE, expirationDate);
      localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_REFRESH_TOKEN, data.refresh_token);
      return;
    });
};

export const refreshToken = () => {

  const header = {
    'Authorization': `Basic ${btoa(`${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`)}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const body = `grant_type=refresh_token&refresh_token=${localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_REFRESH_TOKEN)}`;

  return global.fetch('https://accounts.spotify.com/api/token', { method: 'post', headers: header, body: body })
    .then(response => response.json())
    .then(data => {
      if (data.error_description){
        localStorage.removeItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN);
        localStorage.removeItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN_EXPIRATION_DATE);
        throw new Error(data.error_description);
      }

      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + data.expires_in);
      localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN, data.access_token);
      localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN_EXPIRATION_DATE, expirationDate);
    });
};
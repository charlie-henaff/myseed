import { APP_CONST } from "..";

const spotify_client_scopes = 'user-read-email user-read-private user-library-read user-follow-read user-top-read user-read-recently-played';
const spotify_login_callback = process.env.REACT_APP_BASE_URL + '/login';

export const logged = () => {
    const now = new Date();
    const spotifyToken = localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN);
    const spotifyTokenExpirationDate = new Date(localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN_EXPIRATION_DATE));

    return spotifyToken && spotifyTokenExpirationDate && spotifyTokenExpirationDate > now;
}

export const redirectToSpotifyAuth = () => {
    window.location = 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.REACT_APP_SPOTIFY_CLIENT_ID +
        '&scope=' + encodeURIComponent(spotify_client_scopes) +
        '&redirect_uri=' + encodeURIComponent(spotify_login_callback);
};

export const spotifyGetToken = (code) => {

    const header = {
        'Authorization': `Basic ${btoa(`${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(spotify_login_callback)}`;

    return fetch('https://accounts.spotify.com/api/token', { method: 'post', headers: header, body: body })
        .then(response => response.json())
        .then(data => {
            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() + data.expires_in);
            localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN, data.access_token);
            localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN_EXPIRATION_DATE, expirationDate);
            localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_REFRESH_TOKEN, data.refresh_token);
        });
};
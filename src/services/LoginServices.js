import { APP_CONST } from "../constants";

export const logged = () => {
    const now = new Date();

    const spotifyToken = localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN);
    const spotifyTokenExpirationDate = new Date(localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN_EXPIRATION_DATE));

    return spotifyToken && spotifyTokenExpirationDate && spotifyTokenExpirationDate > now;
}

export const logout = () => {
    localStorage.removeItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN);
    localStorage.removeItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN_EXPIRATION_DATE);
    localStorage.removeItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_REFRESH_TOKEN);
}
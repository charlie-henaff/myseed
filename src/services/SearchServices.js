import { APP_CONST } from "../constants";
import { fetch as spotifyFetch } from "./SpotifyServices";

const header = new Headers({
    'Authorization': `Bearer ${localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)}`,
    'Content-Type': 'application/json'
});

export const search = (input) => {
    const params = [
        `q=${input}`,
        "type=album,artist,track",
        "limit=6"
    ];

    return spotifyFetch(`${process.env.REACT_APP_SPOTIFY_API_ENDPOINT}/search?${params.join('&')}`, { method: 'get', headers: header });
}

export const recommendations = (artistsSeeds = [], tracksSeeds = []) => {
    let params = [];

    if (artistsSeeds.length > 0) {
        params['seed_artists'] = artistsSeeds.join(',');
    }
    if (tracksSeeds.length > 0) {
        params['seed_tracks'] = tracksSeeds.join(',');
    }

    return spotifyFetch(`${process.env.REACT_APP_SPOTIFY_API_ENDPOINT}/recommendations?${params.join('&')}`, { method: 'get', headers: header });
}

export const topsRecommendations = () => {
    const params = [
        "limit=5"
    ];

    return spotifyFetch(`${process.env.REACT_APP_SPOTIFY_API_ENDPOINT}/me/top/artits?${params.join('&')}`, { method: 'get', headers: header })
        .then(result => console.log(result));
}
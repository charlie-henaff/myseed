import { fetch as spotifyFetch } from "./SpotifyServices";

export const recommendations = (artistsSeeds = [], tracksSeeds = []) => {
    let params = [
        "limit=84"
    ];

    if (artistsSeeds.length > 0) {
        params.push(`seed_artists=${artistsSeeds.join(',')}`);
    }
    if (tracksSeeds.length > 0) {
        params.push(`seed_tracks=${tracksSeeds.join(',')}`);
    }

    return spotifyFetch(`/recommendations?${params.join('&')}`, { method: 'get' });
}

export const topsRecommendations = () => {
    return spotifyFetch(`/me/top/artists?limit=3`, { method: 'get' })
        .then(result => result.items.map(item => item.id))
        .then(artistsSeeds =>
            spotifyFetch(`/me/top/tracks?limit=2`, { method: 'get' })
                .then(result => result.items.map(item => item.id))
                .then(tracksSeeds => recommendations(artistsSeeds, tracksSeeds))
        );
}
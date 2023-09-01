import { fetch as spotifyFetch } from "./SpotifyServices";

export const recommendations = (artistsSeeds = [], tracksSeeds = [], optional = {}) => {
    let params = [
        "limit=84",
    ];

    if (artistsSeeds.length > 0) {
        params.push(`seed_artists=${artistsSeeds.join(',')}`);
    }
    if (tracksSeeds.length > 0) {
        params.push(`seed_tracks=${tracksSeeds.join(',')}`);
    }

    if (optional.energy !== undefined && optional.energy !== null) {
        params.push(`target_energy=${optional.energy.toString()}`);
    }
    if (optional.acousticness !== undefined && optional.acousticness !== null) {
        params.push(`target_acousticness=${optional.acousticness.toString()}`);
    }
    if (optional.popularity !== undefined && optional.popularity !== null) {
        params.push(`target_popularity=${optional.popularity.toString()}`);
    }

    return spotifyFetch(`/recommendations?${params.join('&')}`, { method: 'get' });
}

export const topsRecommendations = (optional) => {
    return spotifyFetch(`/me/top/artists?limit=3`, { method: 'get' })
        .then(result => result.items.map(item => item.id))
        .then(artistsSeeds =>
            spotifyFetch(`/me/top/tracks?limit=2`, { method: 'get' })
                .then(result => result.items.map(item => item.id))
                .then(tracksSeeds => recommendations(artistsSeeds, tracksSeeds, optional))
        );
}
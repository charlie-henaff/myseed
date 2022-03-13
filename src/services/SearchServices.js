import { fetch as spotifyFetch } from "./SpotifyServices";

export const search = (input) => {
    const params = [
        `q=${input}`,
        "type=album,artist,track",
        "limit=6"
    ];

    return spotifyFetch(`/search?${params.join('&')}`, { method: 'get' });
}
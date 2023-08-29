import { fetch as spotifyFetch } from "./SpotifyServices";

export const search = (input) => {
    const albumsArtistsparams = [
        `q=${input}`,
        "type=album,artist",
        "limit=6"
    ];

    const tracksParams = [
        `q=${input}`,
        "type=track",
        "limit=48"
    ];

    return spotifyFetch(`/search?${albumsArtistsparams.join('&')}`, { method: 'get' }).then(albumsArtistsresult => {
        return spotifyFetch(`/search?${tracksParams.join('&')}`, { method: 'get' }).then(tracksResults => {
            return { ...albumsArtistsresult, ...tracksResults };
        })

    });
}
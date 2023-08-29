import { Container, Grid, LinearProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import { withStyles } from '@mui/styles';
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { APP_CONST } from "../constants";
import history from '../history';
import { layoutStates } from "../redux/reducers/layout";
import { appBarStates } from "../redux/reducers/layout/appBar";
import { playerState } from "../redux/reducers/layout/player";
import { searchStates } from "../redux/reducers/search";
import store from "../redux/store";
import { search } from "../services/SearchServices";
import { fetch as spotifyFetch } from "../services/SpotifyServices";
import Track from "./Util/Card/Track";

class Search extends Component {

    static propTypes = {
        dispatchSearch: PropTypes.func.isRequired,
        requestSeach: PropTypes.func.isRequired,
        location: PropTypes.object,
        searchInput: PropTypes.string,
        searchLoading: PropTypes.bool,
        searchResult: PropTypes.object,
        searchError: PropTypes.string,
        setPlayerVisible: PropTypes.func.isRequired,
        setPlayerNextUris: PropTypes.func.isRequired,
        setPlayerCurrentUri: PropTypes.func.isRequired,
        currentUri: PropTypes.string,
    }

    state = {
        currentPlayingAlbumArtistId: null
    }

    componentDidMount() {
        if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
            history.push('/login');
        }

        this.props.setPlayerVisible(true);

        store.dispatch({ type: layoutStates.VISIBLE, visible: true });
        store.dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: false });

        const { searchInput, location, dispatchSearch, requestSeach } = this.props;
        const urlSearch = location.pathname.split("/").pop();
        if (urlSearch !== undefined && searchInput !== urlSearch) {
            dispatchSearch(urlSearch);
        } else {
            if (searchInput.length === 0) history.push('/')
            else requestSeach(searchInput);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevSearchInput = prevProps.searchInput;
        const { searchInput, requestSeach } = this.props;
        if (searchInput.length === 0) history.push('/')
        else if (prevSearchInput !== searchInput) requestSeach(searchInput);
    }

    playArtistTopTracks(artistId) {
        const { setPlayerNextUris, setPlayerCurrentUri } = this.props;
        spotifyFetch(`/artists/${artistId}/top-tracks?market=fr`).then(result => {
            const uris = result.tracks.map(track => track.uri);
            const firstUri = uris[0];
            const nextUris = uris.slice(1);
            this.setState({ currentPlayingAlbumArtistId: artistId });
            spotifyFetch('/me/player/play', { method: 'put', body: JSON.stringify({ uris: [firstUri] }) });
            setPlayerNextUris(nextUris);
            setPlayerCurrentUri(firstUri);
        });
    }

    playAlbumTracks(albumId) {
        const { setPlayerNextUris, setPlayerCurrentUri } = this.props;
        spotifyFetch(`/albums/${albumId}/tracks?market=fr&limit=50`).then(result => {
            const uris = result.items.map(track => track.uri);
            const firstUri = uris[0];
            const nextUris = uris.slice(1);
            this.setState({ currentPlayingAlbumArtistId: albumId });
            spotifyFetch('/me/player/play', { method: 'put', body: JSON.stringify({ uris: [firstUri] }) });
            setPlayerNextUris(nextUris);
            setPlayerCurrentUri(firstUri);
        });
    }

    playTracksFrom(trackIndex) {
        const { searchResult, setPlayerNextUris, setPlayerCurrentUri } = this.props;
        const tracks = searchResult && searchResult.tracks.items;
        const selectedUri = tracks[trackIndex].uri;
        this.setState({ currentPlayingAlbumArtistId: null });
        spotifyFetch('/me/player/play', { method: 'put', body: JSON.stringify({ uris: [selectedUri] }) });
        setPlayerNextUris(tracks.slice(trackIndex + 1).map(track => track.uri));
        setPlayerCurrentUri(selectedUri);
    }

    render() {
        const { searchLoading, searchResult } = this.props;
        const artists = searchResult && searchResult.artists.items;
        const albums = searchResult && searchResult.albums.items;
        const tracks = searchResult && searchResult.tracks.items;

        const { classes, currentUri } = this.props;
        const { currentPlayingAlbumArtistId } = this.state;
        return (
            <>
                {searchLoading && <LinearProgress color="secondary" />}
                <Container maxWidth={false}>

                    {(artists || albums) && (
                        <Grid container>
                            {artists && (
                                <Grid container xs={12} sm={6} py={2} className={classes.artistContainer}>
                                    <Typography variant="h6" gutterBottom>Artistes</Typography>
                                    <Grid container spacing={2}>
                                        {artists.map(item => {
                                            return (
                                                <Grid item xs={6} md={4} xl={2}>
                                                    <Track
                                                        name={item.name}
                                                        avatarUrl={item.images[1]?.url}
                                                        key={"artist_" + item.id}
                                                        onCardClick={() => this.playArtistTopTracks(item.id)}
                                                        selected={currentPlayingAlbumArtistId && currentPlayingAlbumArtistId === item.id}
                                                    />
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Grid>
                            )}
                            {albums && (
                                <Grid container xs={12} sm={6} py={2} className={classes.albumContainer}>
                                    <Typography variant="h6" gutterBottom>Albums</Typography>
                                    <Grid container spacing={2}>
                                        {albums.map(item => {
                                            return (
                                                <Grid item xs={6} md={4} xl={2}>
                                                    <Track
                                                        name={item.name}
                                                        avatarUrl={item.images[1]?.url}
                                                        key={"artist_" + item.id}
                                                        onCardClick={() => this.playAlbumTracks(item.id)}
                                                        selected={currentPlayingAlbumArtistId && currentPlayingAlbumArtistId === item.id}
                                                    />
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    )}

                    {tracks && (
                        <Grid container py={1}>
                            <Typography variant="h6" gutterBottom>Musiques</Typography>
                            <Grid container spacing={2}>
                                {tracks.map((item, index) => {
                                    return (
                                        <Grid item xs={6} sm={4} md={2} xl={1}>
                                            <Track name={item.name}
                                                avatarUrl={item.album?.images[1].url}
                                                key={"artist_" + item.id}
                                                onCardClick={() => this.playTracksFrom(index)}
                                                selected={currentUri && currentUri === item.uri}
                                            />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </>
        );
    }
}

const styles = (theme) => ({
    artistContainer: {
        [theme.breakpoints.up('sm')]: {
            paddingRight: theme.spacing(4),
        }
    },
    albumContainer: {
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(4),
        }
    }
});

const actionSeach = (dispatch, input) => {
    dispatch({ type: searchStates.LOADING, loading: true });
    search(input)
        .then(result => dispatch({ type: searchStates.RESULT, result: result }))
        .finally(() => dispatch({ type: searchStates.LOADING, loading: false }))
        .catch(error => {
            if (error.message) {
                dispatch({ type: searchStates.ERROR, error: (error.message || "Une erreur est survenue.") });
            }
        });
}

const mapStateToProps = state => {
    const searchInput = state.app.layout.appBar.search;
    const searchLoading = state.app.search.loading;
    const searchResult = state.app.search.result;
    const searchError = state.app.search.error;
    const currentUri = state.app.layout.player.currentUri;
    return { searchInput, searchLoading, searchResult, searchError, currentUri };
};

const mapDispatchToProps = dispatch => ({
    setPlayerVisible: bool => dispatch({ type: playerState.VISIBLE, visible: bool }),
    dispatchSearch: txt => dispatch({ type: appBarStates.SEARCH, search: txt }),
    requestSeach: txt => actionSeach(dispatch, txt),
    setPlayerNextUris: uris => store.dispatch({ type: playerState.NEXT_URIS, nextUris: uris }),
    setPlayerCurrentUri: uri => store.dispatch({ type: playerState.CURRENT_URI, currentUri: uri }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Search)); 
import { Box, Container, Grid, LinearProgress } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { APP_CONST } from '../constants';
import history from '../history';
import { layoutStates } from "../redux/reducers/layout";
import { appBarStates } from '../redux/reducers/layout/appBar';
import { playerState } from '../redux/reducers/layout/player';
import { playlistStates } from '../redux/reducers/playlist';
import store from '../redux/store';
import { topsRecommendations } from '../services/PlaylistServices';
import { fetch as spotifyFetch } from '../services/SpotifyServices';
import Track from './Util/Card/Track';


class Playlist extends Component {

    static propTypes = {
        isLoading: PropTypes.bool,
        tracks: PropTypes.array,
        currentUri: PropTypes.string,

        setAppBarTitle: PropTypes.func.isRequired,
        setLayoutVisible: PropTypes.func.isRequired,
        setLayoutFullSizeContent: PropTypes.func.isRequired,
        setPlaylistResults: PropTypes.func.isRequired,
        setPlaylistLoading: PropTypes.func.isRequired,
        setPlaylistError: PropTypes.func.isRequired,
        setPlayerVisible: PropTypes.func.isRequired,
        setPlayerNextUris: PropTypes.func.isRequired,
        setPlayerCurrentUri: PropTypes.func.isRequired,
    };

    componentDidMount() {
        if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
            history.push('/login');
        }

        const {
            setAppBarTitle,
            setLayoutVisible,
            setLayoutFullSizeContent,
            setPlayerVisible
        } = this.props;

        setAppBarTitle('Playlist');
        setLayoutVisible(true);
        setLayoutFullSizeContent(false);
        setPlayerVisible(true);

        this.getTopRecomendations();
    }

    componentWillUnmount() {
        const { setPlayerVisible } = this.props;
        setPlayerVisible(false);
    }


    getTopRecomendations = () => {
        const { setPlaylistLoading, setPlaylistResults, setPlaylistError } = this.props;
        setPlaylistLoading(true);
        topsRecommendations()
            .then(result => setPlaylistResults(result.tracks))
            .finally(() => setPlaylistLoading(false))
            .catch(error => error.message && setPlaylistError(error.message || "Une erreur est survenue."));
    };

    startPLaylistHere(trackIndex) {
        const { tracks, setPlayerNextUris, setPlayerCurrentUri } = this.props;
        const selectedUri = tracks[trackIndex].uri;
        spotifyFetch('/me/player/play', { method: 'put', body: JSON.stringify({ uris: [selectedUri] }) });
        setPlayerNextUris(tracks.slice(trackIndex + 1).map(track => track.uri));
        setPlayerCurrentUri(selectedUri);
    }

    render() {
        const {
            isLoading,
            tracks,
            currentUri,
        } = this.props;

        return (
            <>
                {isLoading && <LinearProgress color="secondary" />}
                <Container maxWidth={false}>
                    {isLoading || !tracks ? "" : (
                        <Box py={2}>
                            <Grid container spacing={2}>
                                {tracks.map((item, index) => {
                                    return <Track name={item.name}
                                        avatarUrl={item.album?.images[1].url}
                                        key={"artist_" + item.id}
                                        onCardClick={() => this.startPLaylistHere(index)}
                                        selected={currentUri && currentUri === item.uri}
                                    />
                                })}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </>
        );
    }
}

const mapStateToProps = state => {
    const isLoading = state.app.playlist.loading;
    const tracks = state.app.playlist.result;
    const error = state.app.playlist.error;
    const currentUri = state.app.layout.player.currentUri;
    return { isLoading, tracks, error, currentUri };
};

const mapDispatchToProps = dispatch => ({
    setAppBarTitle: title => store.dispatch({ type: appBarStates.TITLE, title: title }),
    setLayoutVisible: visible => dispatch({ type: layoutStates.VISIBLE, visible: visible }),
    setLayoutFullSizeContent: fullSizeContent => store.dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: fullSizeContent }),
    setPlaylistResults: results => store.dispatch({ type: playlistStates.RESULT, result: results }),
    setPlaylistLoading: isLoading => store.dispatch({ type: playlistStates.LOADING, loading: isLoading }),
    setPlaylistError: error => store.dispatch({ type: playlistStates.ERROR, error: error }),
    setPlayerVisible: visible => store.dispatch({ type: playerState.VISIBLE, visible: visible }),
    setPlayerNextUris: uris => store.dispatch({ type: playerState.NEXT_URIS, nextUris: uris }),
    setPlayerCurrentUri: uri => store.dispatch({ type: playerState.CURRENT_URI, currentUri: uri }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);

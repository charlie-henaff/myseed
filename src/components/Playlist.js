import { TuneRounded } from '@mui/icons-material';
import { Box, Container, Grid, IconButton, LinearProgress, Menu } from '@mui/material';
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
        setAppBarRightComponent: PropTypes.func.isRequired,
        setLayoutVisible: PropTypes.func.isRequired,
        setLayoutFullSizeContent: PropTypes.func.isRequired,
        setPlaylistResults: PropTypes.func.isRequired,
        setPlaylistLoading: PropTypes.func.isRequired,
        setPlaylistError: PropTypes.func.isRequired,
        setPlayerVisible: PropTypes.func.isRequired,
        setPlayerNextUris: PropTypes.func.isRequired,
        setPlayerCurrentUri: PropTypes.func.isRequired,
    };

    state = {
        tuneMenu: {
            open: false,
            anchor: null
        }
    };

    componentDidMount() {
        if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
            history.push('/login');
        }

        this.props.setAppBarTitle('Playlist');
        this.props.setAppBarRightComponent(this.renderAppBarTune())

        this.props.setLayoutVisible(true);
        this.props.setLayoutFullSizeContent(false);
        this.props.setPlayerVisible(true);

        this.getTopRecomendations();
    }

    componentWillUnmount() {
        this.props.setAppBarTitle('');
        this.props.setAppBarRightComponent(null);
        this.props.setLayoutVisible(false);
        this.props.setLayoutFullSizeContent(true);
        this.props.setPlayerVisible(false);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tuneMenu.open !== this.state.tuneMenu.open) {
            this.props.setAppBarRightComponent(this.renderAppBarTune())
        }
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

        const { tuneMenu } = this.state;

        console.log(tuneMenu);

        return (
            <>
                {isLoading && <LinearProgress color="secondary" />}
                <Container maxWidth={false}>
                    {isLoading || !tracks ? "" : (
                        <Box py={2}>
                            <Grid container spacing={2}>
                                {tracks.map((item, index) => {
                                    return (
                                        <Grid item xs={6} sm={4} md={2} xl={1}>
                                            <Track name={item.name}
                                                avatarUrl={item.album?.images[1].url}
                                                key={"artist_" + item.id}
                                                onCardClick={() => this.startPLaylistHere(index)}
                                                selected={currentUri && currentUri === item.uri}
                                            />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Box>
                    )}
                </Container>
                <Menu
                    id="tunePlaylistMenu"
                    open={tuneMenu.open}
                    onClose={() => this.setState({ tuneMenu: { ...tuneMenu, anchor: null } })}
                    PaperProps={{
                        elevation: 1,
                        sx: {
                            minHeight: 200,
                            minWidth: 200,
                            maxHeight: 200,
                            marginBottom: 150,
                            overflow: 'auto',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        },
                    }}
                >
                    {/* {this.state.devices.list && this.state.devices.list.map(device =>
    <MenuItem dense key={device.id} onClick={() => this.updatePlayingDevices(device.id)}>
        <ListItemIcon sx={{ color: device.id === localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID) ? theme.palette.secondary.main : '' }}><ComputerRounded fontSize="small" /></ListItemIcon>
        <ListItemText sx={{ color: device.id === localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID) ? theme.palette.secondary.main : '' }}>{device.name}</ListItemText>
    </MenuItem>
)} */}
                </Menu>
            </>
        );
    }

    renderAppBarTune() {
        const { tuneMenu } = this.state;
        return (
            <>
                <IconButton
                    color="inherit"
                    edge="end"
                    aria-controls={tuneMenu.open ? 'tunePlaylistMenu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={tuneMenu.open ? 'true' : undefined}
                    onClick={event => this.setState({ tuneMenu: { ...tuneMenu, open: !tuneMenu.open, anchor: !tuneMenu.open ? event.currentTarget : null } })}>
                    <TuneRounded />
                </IconButton>
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
    setAppBarRightComponent: component => store.dispatch({ type: appBarStates.RIGHT_COMPONENT, rightComponent: component }),
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

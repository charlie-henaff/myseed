import { BoltRounded, DeleteRounded, FilterAltOffRounded, GroupsRounded, PianoRounded, TuneRounded } from '@mui/icons-material';
import { Box, Container, Grid, IconButton, LinearProgress, Popover, Slider, Stack, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
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

const AppBarTunePlaylistIcon = ({ open, onClick }) => {
    return (
        <IconButton
            color="inherit"
            edge="end"
            aria-controls={open ? 'tunePlaylistMenu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(event) => onClick(event)}>
            <TuneRounded />
        </IconButton>
    );
};

const AppBarTuneMenuSlider = ({ label, icon, min, max, step, value, onChange, onChangeCommitted, disable }) => {
    return (
        <>
            <Typography>{label}</Typography>
            <Stack spacing={4} direction="row" alignItems='center'>
                {value != null ? icon : <FilterAltOffRounded />}
                <Slider
                    min={min} max={max} step={step} value={value}
                    onChange={onChange}
                    onChangeCommitted={onChangeCommitted}
                />
                <IconButton onClick={disable}>
                    <DeleteRounded color='error' />
                </IconButton>
            </Stack>
        </>
    );
}

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
            anchor: null,
            energy: null,
            acousticness: null,
            popularity: null,
        }
    };

    componentDidMount() {
        if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
            history.push('/login');
        }

        const { tuneMenu } = this.state;

        this.props.setAppBarTitle('Playlist');
        this.props.setAppBarRightComponent(
            <AppBarTunePlaylistIcon
                open={tuneMenu.open}
                onClick={(event) => this.openTuneMenu(event.currentTarget)}
            />
        );

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

    getTopRecomendations() {
        const { setPlaylistLoading, setPlaylistResults, setPlaylistError } = this.props;
        const { tuneMenu } = this.state;

        setPlaylistLoading(true);

        topsRecommendations({
            energy: tuneMenu.energy,
            acousticness: tuneMenu.acousticness,
            popularity: tuneMenu.popularity,
        })
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

    openTuneMenu(anchor) {
        const { tuneMenu } = this.state;
        this.setState({ tuneMenu: { ...tuneMenu, open: true, anchor: anchor } })
    }

    setEnergy(value) {
        const { tuneMenu } = this.state;
        this.setState({ tuneMenu: { ...tuneMenu, energy: value } });
    }

    disableEnergy() {
        this.setEnergy(0);
        this.setEnergy(null);
        this.getTopRecomendations();
    }

    setAcousticness(value) {
        const { tuneMenu } = this.state;
        this.setState({ tuneMenu: { ...tuneMenu, acousticness: value } });
    }

    disableAcousticness() {
        this.setAcousticness(0);
        this.setAcousticness(null);
        this.getTopRecomendations();
    }

    setPopularity(value) {
        const { tuneMenu } = this.state;
        this.setState({ tuneMenu: { ...tuneMenu, popularity: value } });
    }

    disablePopularity() {
        this.setPopularity(0);
        this.setPopularity(null);
        this.getTopRecomendations();
    }

    render() {
        const {
            isLoading,
            tracks,
            currentUri,
            classes
        } = this.props;

        const { tuneMenu } = this.state;

        return (
            <>
                {/* Tune playlist controls */}
                <Popover
                    open={tuneMenu.open}
                    anchorEl={tuneMenu.anchor}
                    onClose={() => this.setState({ tuneMenu: { ...tuneMenu, open: false, anchor: null } })}
                    PaperProps={{ className: classes.tuneMenuPopoverPaper }}
                    anchorOrigin={{
                        vertical: 58,
                        horizontal: 'left',
                    }}
                >
                    <Grid container direction="column" spacing={2} p={2} >
                        <Grid item>
                            <AppBarTuneMenuSlider
                                label={`Niveau d'énergie (${tuneMenu.energy == null ? 'désactivé' : parseInt(tuneMenu.energy * 100) + '%'})`}
                                icon={<BoltRounded />}
                                min={0} max={1} step={0.01}
                                value={tuneMenu.energy}
                                onChange={(event, value) => this.setEnergy(value)}
                                onChangeCommitted={() => this.getTopRecomendations()}
                                disable={() => this.disableEnergy()}
                            />
                        </Grid>
                        <Grid item >
                            <AppBarTuneMenuSlider
                                label={`Niveau d'accousticité (${tuneMenu.acousticness == null ? 'désactivé' : parseInt(tuneMenu.acousticness * 100) + '%'})`}
                                icon={<PianoRounded />}
                                min={0} max={1} step={0.01}
                                value={tuneMenu.acousticness}
                                onChange={(event, value) => this.setAcousticness(value)}
                                onChangeCommitted={() => this.getTopRecomendations()}
                                disable={() => this.disableAcousticness()}
                            />
                        </Grid>
                        <Grid item >
                            <AppBarTuneMenuSlider
                                label={`Niveau de popularité (${tuneMenu.popularity == null ? 'désactivé' : parseInt(tuneMenu.popularity) + '%'})`}
                                icon={<GroupsRounded />}
                                min={0} max={100} step={1}
                                value={tuneMenu.popularity}
                                onChange={(event, value) => this.setPopularity(value)}
                                onChangeCommitted={() => this.getTopRecomendations()}
                                disable={() => this.disablePopularity()}
                            />
                        </Grid>
                    </Grid>
                </Popover>

                {/* Page loader */}
                {isLoading && <LinearProgress color="secondary" />}

                {/* Playlist result items */}
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
            </>
        );
    }
}

const styles = (theme) => ({
    tuneMenuPopoverPaper: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '60%',
        },
        [theme.breakpoints.up('xl')]: {
            width: '30%',
        },
    }
});

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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Playlist));

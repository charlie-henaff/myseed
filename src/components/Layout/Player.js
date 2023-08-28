import { AddRounded, ComputerRounded, DevicesRounded, KeyboardArrowUpRounded, PauseRounded, PlayArrowRounded, SkipNextRounded, VolumeUpRounded } from '@mui/icons-material';
import { Box, Button, CardMedia, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Popover, Slide, Slider, Typography, colors } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { APP_CONST } from '../../constants';
import { playerState } from '../../redux/reducers/layout/player';
import { fetch as spotifyFetch } from '../../services/SpotifyServices';
import theme from '../../theme';

class Player extends Component {

    static propTypes = {
        nextUris: PropTypes.array,
        currentUri: PropTypes.func.isRequired,
        setPlayerNextUris: PropTypes.func.isRequired,
        setPlayerCurrentUri: PropTypes.func.isRequired,
    };

    state = {
        localPlayerReady: false,
        localPlayerActivated: false,
        localPlayerId: null,
        isPlaying: false,
        isPlayedLocally: true,
        updatingProgress: false,
        progress: 0,
        duration: 1,
        title: '',
        artist: '',
        img: '',
        uri: '',
        volume: 100,
        openVolumePopoverAnchor: null,
        devices: {
            list: [],
            openMenuAnchor: null,
        }
    }

    playbackStateInterval = null;
    player = null;

    componentDidMount() {
        this.getDevices();
        this.player = this.getPlayer();
        this.startFetchPlaybackStateInterval();
    }

    componentDidUpdate(prevProps, prevState) {
        const { setPlayerCurrentUri } = this.props;

        const progressHasChanged = prevState.progress !== this.state.progress;
        const uriHasChanged = prevState.uri !== this.state.uri;
        const newProgressIsAStart = this.state.progress === 0;

        // trigger next track on end 
        if (progressHasChanged && !uriHasChanged && newProgressIsAStart) {
            this.nextTrack();
        }

        // trigger current playing uri changed
        if (this.state.uri && uriHasChanged) {
            setPlayerCurrentUri(this.state.uri);
        }
    }

    componentWillUnmount() {
        this.stopFetchPlaybackInterval();
        this.player.then(player => player.disconnect());
    }

    getPlayer() {
        return new Promise(resolve => {

            if (!window.Spotify) {
                setTimeout(() => resolve(this.getPlayer()), 1000);
                return;
            }

            const player = new window.Spotify.Player({
                name: 'mySeed',
                getOAuthToken: cb => { cb(localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)); },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }) => {
                this.setState({
                    localPlayerReady: true,
                    localPlayerId: device_id
                });
                this.getDevices();
            });

            player.activateElement();
            player.connect();

            setTimeout(() => resolve(player), 1000);
        });
    }

    activateLocalPlayer(){
        this.player.then(player => {
            player.activateElement();
            this.setState({localPlayerActivated: true});
        });
    }

    getDevices() {
        spotifyFetch('/me/player/devices').then(res => {
            if (res?.devices) {
                const activeDevice = res.devices.find(device => device.is_active);
                if (activeDevice && activeDevice !== "undefined" && activeDevice.id) {
                    localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID, activeDevice.id);
                } else if (this.state.localPlayerId) {
                    localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID, this.state.localPlayerId);
                }
                this.setState({
                    devices: {
                        ...this.state.devices,
                        list: res.devices,
                    }
                });
            } else if (this.state.localPlayerId) {
                localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID, this.state.localPlayerId);
            }
        });
    }

    updatePlayingDevices(device_id) {
        return spotifyFetch('/me/player', { method: 'PUT', body: JSON.stringify({ device_ids: [device_id] }) })
            .then(() => {
                localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID, device_id);
                this.setState({
                    devices: {
                        ...this.state.devices,
                        openMenuAnchor: null
                    }
                });
            });
    }

    fetchPlaybackState() {
        spotifyFetch('/me/player').then(playbackState => {
            this.setState({
                isPlaying: playbackState?.is_playing || false,
                isPlayedLocally:  playbackState?.device?.id == null || playbackState?.device?.id === this.state.localPlayerId,
                duration: playbackState?.item?.duration_ms || 0,
                title: playbackState?.item?.name || null,
                artist: playbackState?.item?.artists.map(artist => artist.name).join(', ') || null,
                img: playbackState?.item?.album.images[0].url || null,
                uri: playbackState?.item?.uri || null
            });
            if (!this.state.updatingProgress) {
                this.setState({ progress: playbackState?.progress_ms || 0 });
            }
        });
    }

    startFetchPlaybackStateInterval() {
        if (this.playbackStateInterval !== null) clearInterval(this.playbackStateInterval);
        this.playbackStateInterval = setInterval(() => {
            this.fetchPlaybackState();
        }, 1000);
    }

    stopFetchPlaybackInterval() {
        if (this.playbackStateInterval !== null) clearInterval(this.playbackStateInterval);
        this.playbackStateInterval = null;
    }

    play() {
        spotifyFetch('/me/player/play', { method: 'PUT', body: JSON.stringify({ uris: [this.state.uri], position_ms: this.state.progress }) });
    }

    pause() {
        spotifyFetch('/me/player/pause', { method: 'PUT' });
    }

    togglePlay() {
        if (this.state.isPlaying) this.pause();
        else this.play();
    }

    nextTrack() {
        const { nextUris, setPlayerNextUris } = this.props;
        const nextUri = nextUris[0];
        if (nextUri) {
            spotifyFetch('/me/player/play', { method: 'put', body: JSON.stringify({ uris: [nextUri] }) });
            setPlayerNextUris(nextUris.slice(1));
        }
    }

    openDevicesMenu(event) {
        this.getDevices();
        this.setState({ devices: { ...this.state.devices, openMenuAnchor: event.currentTarget } });
    }

    updatingProgress(newProgress) {
        this.setState({
            updatingProgress: true,
            progress: newProgress
        });
    }

    updateProgress(newProgress) {
        this.setState({ progress: newProgress });
        spotifyFetch('/me/player/seek?position_ms=' + newProgress, { method: 'PUT' })
            .then(() => this.setState({ updatingProgress: false }));
    }

    openSpotifyTrack() {
        let uri = this.state.uri.split(":").slice(1, 3).join('/');
        window.open("https://open.spotify.com/" + uri);
    }

    openVolumePopover(event) {
        spotifyFetch('/me/player').then(playbackState => this.setState({ volume: playbackState?.device?.volume_percent || 0 }));
        this.setState({ openVolumePopoverAnchor: event.currentTarget });
    }

    updateVolume(newVolume) {
        this.setState({ volume: newVolume });
        spotifyFetch('/me/player/volume?volume_percent=' + newVolume, { method: 'PUT' })
            .then(() => this.setState({ openVolumePopoverAnchor: null }));
    }

    render() {
        const isDevicesMenuOpen = Boolean(this.state.devices.openMenuAnchor);
        const isVolumePopoverOpen = Boolean(this.state.openVolumePopoverAnchor);
        const { classes } = this.props;
        return (
            <Slide direction="up" in={this.state.localPlayerReady} mountOnEnter unmountOnExit>
                <Box className={classes.root}>
                    <Box className={classes.shape}>
                        <Box className={classes.content}>

                            {!this.state.localPlayerActivated & this.state.isPlayedLocally 
                                ?
                                <Box p={3} sx={{ mx: 'auto'}}>
                                    <Button size="large" sx={{color: 'white'}} endIcon={<AddRounded />} onClick={() => this.activateLocalPlayer()}>
                                        Activer le lecteur local
                                    </Button>
                                </Box>
                                :
                                <>
                                    {this.state.img &&
                                        <Box className={classes.leftControls}>
                                            <CardMedia className={classes.albumCardMedia} image={this.state.img}>
                                                <Box className={classes.albumCardMediaControls}>
                                                    <IconButton className={classes.albumMediaCardBtn} size='small' onClick={() => this.openSpotifyTrack()}>
                                                        <KeyboardArrowUpRounded sx={{ fontSize: '28px', color: 'white' }} />
                                                    </IconButton>
                                                </Box>
                                            </CardMedia>
                                        </Box>
                                    }

                                    <Box className={classes.mediaData} pl={!this.state.img ? 3 : 1}>
                                        <Typography component='p' variant='body2' noWrap >{this.state.title || "Bonnes découvertes !"}</Typography>
                                        <Typography component='p' variant='caption' noWrap >{this.state.artist || "Choissisez un titre pour commencer"}</Typography>
                                        <Slider size="small" color='secondary'
                                            value={this.state.progress} min={0} max={this.state.duration}
                                            onChange={(event, value) => this.updatingProgress(value)}
                                            onChangeCommitted={(event, value) => this.updateProgress(value)}
                                            sx={{ height: 4, padding: '0 !important' }}
                                        />
                                    </Box>

                                    <Box className={classes.rightControls}>
                                        <IconButton id="devicesBtn" size='small '
                                            sx={{ color: this.state.isPlayedLocally ? 'white' : theme.palette.secondary.main }}
                                            aria-controls={isDevicesMenuOpen ? 'devicesMenu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={isDevicesMenuOpen ? 'true' : undefined}
                                            onClick={event => this.openDevicesMenu(event)}
                                        >
                                            {this.state.isPlayedLocally
                                                ? <ComputerRounded sx={{ color: 'white' }} />
                                                : <DevicesRounded sx={{ color: theme.palette.secondary.main }} />}
                                        </IconButton>
                                        {!this.state.isPlayedLocally &&
                                            <IconButton size='small' sx={{ color: 'white' }}
                                                aria-controls={isVolumePopoverOpen ? 'volumePopover' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={isVolumePopoverOpen ? 'true' : undefined}
                                                onClick={event => this.openVolumePopover(event)}
                                            >
                                                <VolumeUpRounded sx={{ color: 'white' }} />
                                            </IconButton>
                                        }
                                        <IconButton size='small' sx={{ color: 'white' }} onClick={() => this.togglePlay()}>
                                            {this.state.isPlaying
                                                ? <PauseRounded sx={{ color: 'white' }} />
                                                : <PlayArrowRounded sx={{ color: 'white' }} />
                                            }
                                        </IconButton>
                                        <IconButton size='small' sx={{ color: 'white' }} onClick={() => this.nextTrack()}>
                                            <SkipNextRounded sx={{ color: 'white' }} />
                                        </IconButton>

                                        {this.devicesMenuRender()}
                                        {this.popupVolumeRender()}
                                    </Box>
                                </>
                            }

                        </Box>
                    </Box>
                </Box>
            </Slide>
        );
    }

    devicesMenuRender() {
        const open = Boolean(this.state.devices.openMenuAnchor);
        return (
            <Menu
                id="devicesMenu"
                open={open}
                anchorEl={this.state.devices.openMenuAnchor}
                onClose={() => this.setState({ devices: { ...this.state.devices, openMenuAnchor: null } })}
                PaperProps={{
                    elevation: 1,
                    sx: {
                        maxHeight: 200,
                        overflow: 'auto',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    },
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'top' }}
            >
                {this.state.devices.list && this.state.devices.list.map(device =>
                    <MenuItem dense key={device.id} onClick={() => this.updatePlayingDevices(device.id)}>
                        <ListItemIcon sx={{ color: device.id === localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID) ? theme.palette.secondary.main : '' }}><ComputerRounded fontSize="small" /></ListItemIcon>
                        <ListItemText sx={{ color: device.id === localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID) ? theme.palette.secondary.main : '' }}>{device.name}</ListItemText>
                    </MenuItem>
                )}
            </Menu>

        );
    }

    popupVolumeRender() {
        const open = Boolean(this.state.openVolumePopoverAnchor);
        return (
            <Popover
                id='volumePopover'
                open={open}
                anchorEl={this.state.openVolumePopoverAnchor}
                onClose={() => this.setState({ openVolumePopoverAnchor: null })}
                PaperProps={{
                    elevation: 1,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        padding: '19px 0 10px 0'
                    },
                }}
                transformOrigin={{ horizontal: 'top', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
                <Slider
                    orientation='vertical' color='secondary'
                    value={this.state.volume} min={0} max={100}
                    onChange={(event, value) => this.setState({ volume: value })}
                    onChangeCommitted={(event, value) => this.updateVolume(value)}
                    sx={{ height: '200px' }}
                />
            </Popover>
        );
    }
}

const styles = (theme) => ({
    root: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
    },
    shape: {
        boxShadow: '0 15px 25px rgba(129, 124, 124, 0.2)',
        backdropFilter: 'blur(14px)',
        backgroundColor: 'rgba(25, 118, 210, 0.75)',
        borderRadius: '20px',
        margin: '5px 10px'
    },
    content: {
        display: 'flex',
        width: '100%',
    },

    leftControls: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        minWidth: '58px',
        justifyContent: 'left'
    },
    albumCardMedia: {
        flexGrow: 1,
        borderRadius: '15px 15px 0 15px',
        height: '84px',
        maxWidth: '150px',
    },
    albumCardMediaOverlay: {
        color: colors.grey["900"],
        opacity: 0.4,
        position: 'relative',
        borderRadius: '15px 15px 0 15px',
    },
    albumCardMediaControls: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    albumMediaCardBtn: {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    mediaData: {
        flex: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'flex-start',
        color: 'white',
        padding: '8px'
    },

    rightControls: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right',
        padding: '15px'
    }

});

const mapStateToProps = state => {
    const nextUris = state.app.layout.player.nextUris;
    return { nextUris };
};

const mapDispatchToProps = dispatch => ({
    currentUri: uri => dispatch({ type: playerState.CURRENT_URI, currentUri: uri }),
    setPlayerNextUris: uris => dispatch({ type: playerState.NEXT_URIS, nextUris: uris }),
    setPlayerCurrentUri: uri => dispatch({ type: playerState.CURRENT_URI, currentUri: uri })
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Player));
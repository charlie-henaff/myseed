import { ComputerRounded, DevicesRounded, FavoriteBorderRounded, KeyboardArrowUpRounded, PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import { CardMedia, colors, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Slide, Slider, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { connect } from 'react-redux';
import { APP_CONST } from '../../constants';
import { fetch as fetchSpotify, play as playSpotify } from '../../services/SpotifyServices';
import theme from '../../theme';

const { Component } = require("react");

class Player extends Component {

    state = {
        isPlaying: false,
        isPlayedLocally: false,
        progress: 0,
        duration: 1,
        title: '',
        artist: '',
        img: '',
        devices: {
            list: [],
            openMenuAnchor: null,
        }
    }

    progressInterval = null;
    playbackStateInterval = null;
    player = new Promise(resolve => {
        if (window.Spotify) {

            const player = new window.Spotify.Player({
                name: 'mySeed',
                getOAuthToken: cb => { cb(localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)); },
                // volume: 0.25
            });

            player.connect().then(isReady => {
                if (isReady) {

                    player.addListener('ready', ({ device_id }) => {
                        localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID, device_id);

                        fetchSpotify('/me/player').then(playbackState => {
                            if (!playbackState) {
                                this.initPlayerIfNotCurrentlyPlaying();
                                return;
                            }

                            this.setState({
                                isPlaying: playbackState.is_playing,
                                progress: playbackState.progress_ms,
                                duration: playbackState.item.duration_ms,
                                title: playbackState.item.name,
                                artist: playbackState.item.artists.map(artist => artist.name).join(', '),
                                img: playbackState.item.album.images[0].url
                            });

                            this.toggleProgressInterval();
                            if (!this.state.isPlayedLocally) this.startFetchPlaybackState();
                        });

                        player.addListener('player_state_changed', playbackState => {
                            this.updateState(playbackState)
                        });

                        player.activateElement();

                        this.getDevices();
                        resolve(player);

                    });
                }
            });
        }
    });

    componentWillUnmount() {
        this.stopProgressInterval();
        clearInterval(this.playbackStateInterval);
        this.player.then(player => player.disconnect());
    }

    getDevices() {
        fetchSpotify('/me/player/devices').then(res => {
            if (res?.devices) {
                localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID, res.devices.find(device => device.is_active).id);
                this.setState({
                    devices: {
                        ...this.state.devices,
                        list: res.devices,
                    }
                });
            }
        });
    }

    updateState(playerState) {
        const currentTrack = playerState?.track_window.current_track;

        if (!playerState || !currentTrack) {
            this.setState({ isPlayedLocally: false });
            this.startFetchPlaybackState();
            return;
        }

        this.setState({
            isPlaying: !playerState.paused,
            progress: playerState.position,
            duration: playerState.duration,
            title: currentTrack.name,
            artist: currentTrack.artists.map(artist => artist.name).join(', '),
            img: currentTrack.album.images[0].url,
            isPlayedLocally: true,
        });

        this.toggleProgressInterval();

        if (this.state.isPlayedLocally) {
            clearInterval(this.playbackStateInterval);
            this.playbackStateInterval = null;
        }
    }

    startProgressInterval() {
        if (this.progressInterval !== null) this.stopProgressInterval();
        this.setState({ isPlaying: true });
        this.progressInterval = setInterval(() => {
            this.setState({ progress: this.state.progress + 1000 });
            if (this.state.progress >= this.state.duration) {
                this.startFetchPlaybackState();
            }
        }, 1000);
    }

    stopProgressInterval() {
        this.setState({ isPlaying: false });
        if (this.progressInterval !== null) clearInterval(this.progressInterval);
    }

    toggleProgressInterval() {
        if (this.state.isPlaying) this.startProgressInterval()
        else this.stopProgressInterval();
    }

    initPlayerIfNotCurrentlyPlaying() {
        fetchSpotify('/me/player', { method: 'PUT', body: JSON.stringify({ device_ids: [localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID)] }) }).then(() => {
            this.setState({ isPlayedLocally: true });
        }).catch(() => setTimeout(() => this.initPlayerIfNotCurrentlyPlaying(), 1000));
    }

    startFetchPlaybackState() {
        if (this.playbackStateInterval !== null) clearInterval(this.playbackStateInterval);
        this.playbackStateInterval = setInterval(() => {
            if (this.state.isPlayedLocally) {
                clearInterval(this.playbackStateInterval);
                this.playbackStateInterval = null;
                return;
            }
            fetchSpotify('/me/player').then(playbackState => {
                if (playbackState) {
                    this.setState({
                        isPlaying: playbackState.is_playing,
                        progress: playbackState.progress_ms,
                        duration: playbackState.item.duration_ms,
                        title: playbackState.item.name,
                        artist: playbackState.item.artists.map(artist => artist.name).join(', '),
                        img: playbackState.item.album.images[0].url,
                        isPlayedLocally: false
                    });
                }
            });
            this.toggleProgressInterval();
        }, 3000);
    }

    play() {
        this.startProgressInterval();
        playSpotify({}).then(() => {
            if (!this.state.isPlayedLocally) setTimeout(() => this.startFetchPlaybackState(), 500);
        });
    }

    pause() {
        this.stopProgressInterval();
        fetchSpotify('/me/player/pause', { method: 'PUT' }).then(() => {
            if (!this.state.isPlayedLocally) setTimeout(() => this.startFetchPlaybackState(), 500);
        });
    }

    togglePlay() {
        if (this.state.isPlaying) this.pause();
        else this.play();
    }

    openDevicesMenu(event) {
        this.getDevices();
        this.setState({ devices: { ...this.state.devices, openMenuAnchor: event.currentTarget } });

    }

    render() {
        const isDevicesMenuOpen = Boolean(this.state.devices.openMenuAnchor);
        const { classes } = this.props;
        return (
            <Slide direction="up" in={this.state.title.length > 1} mountOnEnter unmountOnExit>
                <Box className={classes.root}>
                    <Box className={classes.shape}>
                        <Box className={classes.content}>

                            <Box className={classes.leftControls}>
                                <CardMedia className={classes.albumCardMedia} image={this.state.img}>
                                    <Box className={classes.albumCardMediaControls}>
                                        <IconButton className={classes.albumMediaCardBtn} size='small'>
                                            <KeyboardArrowUpRounded sx={{ fontSize: '28px', color: 'white' }} />
                                        </IconButton>
                                    </Box>
                                </CardMedia>
                            </Box>

                            <Box className={classes.mediaData}>
                                <Typography variant='body2' noWrap >{this.state.title}</Typography>
                                <Typography variant='caption' noWrap >{this.state.artist}</Typography>
                                <Slider size="small" value={this.state.progress} min={0} max={this.state.duration} color='secondary' sx={{ height: 4, padding: '0 !important' }} />
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
                                <IconButton size='small' sx={{ color: 'white' }} >
                                    <FavoriteBorderRounded sx={{ color: 'white' }} />
                                </IconButton>
                                <IconButton size='small' sx={{ color: 'white' }} onClick={() => this.togglePlay()}>
                                    {this.state.isPlaying
                                        ? <PauseRounded sx={{ color: 'white' }} />
                                        : <PlayArrowRounded sx={{ color: 'white' }} />
                                    }
                                </IconButton>

                                {this.devicesMenuRender()}
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Slide>
        );
    }

    devicesMenuRender() {
        const isDevicesMenuOpen = Boolean(this.state.devices.openMenuAnchor);
        return (
            <Menu
                id="devicesMenu"
                open={isDevicesMenuOpen}
                onClose={() => this.setState({ devices: { ...this.state.devices, openMenuAnchor: null } })}
                anchorEl={this.state.devices.openMenuAnchor}
                PaperProps={{
                    elevation: 1,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    },
                }}
                transformOrigin={{ horizontal: 'top', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                {this.state.devices.list && this.state.devices.list.map(device =>
                    <MenuItem dense key={device.id}>
                        <ListItemIcon sx={{ color: device.id === localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID) ? theme.palette.secondary.main : '' }}><ComputerRounded fontSize="small" /></ListItemIcon>
                        <ListItemText sx={{ color: device.id === localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID) ? theme.palette.secondary.main : '' }}>{device.name}</ListItemText>
                    </MenuItem>
                )}
            </Menu>

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
    return {};
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Player));
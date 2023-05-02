import { ComputerRounded, DevicesRounded, KeyboardArrowUpRounded, PauseRounded, PlayArrowRounded, VolumeUpRounded } from '@mui/icons-material';
import { Box, CardMedia, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Popover, Slide, Slider, Typography, colors } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Component } from 'react';
import { APP_CONST } from '../../constants';
import { fetch as spotifyFetch } from '../../services/SpotifyServices';
import theme from '../../theme';

class Player extends Component {

    state = {
        isPlaying: false,
        isPlayedLocally: false,
        progress: 0,
        duration: 1,
        title: '',
        artist: '',
        img: '',
        uri: '',
        url: '',
        volume: 50,
        openVolumePopoverAnchor: null,
        devices: {
            list: [],
            openMenuAnchor: null,
        }
    }

    progressInterval = null;
    playbackStateInterval = null;
    player = null;
    localPlayerId = null;

    componentDidMount() {
        this.player = this.getPlayer();
    }

    componentWillUnmount() {
        this.stopProgressInterval();
        this.stopFetchPlaybackInterval();
        this.player.then(player => player.disconnect());
    }

    getPlayer() {
        return new Promise(resolve => {
            if (window.Spotify) {

                const player = new window.Spotify.Player({
                    name: 'mySeed',
                    getOAuthToken: cb => { cb(localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)); },
                    volume: 0.5
                });

                player.addListener('ready', ({ device_id }) => {
                    this.localPlayerId = device_id;

                    spotifyFetch('/me/player').then(playbackState => {
                        if (!playbackState) {
                            this.updatePlayingDevices(device_id).then(() => {
                                localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID, device_id);
                                this.setState({ isPlayedLocally: true });
                            });
                            return;
                        }

                        this.setState({
                            isPlaying: playbackState.is_playing,
                            progress: playbackState.progress_ms,
                            duration: playbackState.item.duration_ms,
                            title: playbackState.item.name,
                            artist: playbackState.item.artists.map(artist => artist.name).join(', '),
                            img: playbackState.item.album.images[0].url,
                            uri: playbackState.item.uri,
                            volume: playbackState.device.volume_percent
                        });

                        this.toggleProgressInterval();
                        if (!this.state.isPlayedLocally) this.startFetchPlaybackStateInterval();
                    });

                    this.getDevices();
                });

                player.addListener('player_state_changed', playbackState => {
                    this.updateState(playbackState)
                });

                player.activateElement();
                player.connect();

                setTimeout(() => resolve(player), 1000);
            }
        });
    }

    getDevices() {
        spotifyFetch('/me/player/devices').then(res => {
            if (res?.devices) {
                const activeDevice = res.devices.find(device => device.is_active);
                if (activeDevice && activeDevice !== "undefined" && activeDevice.id) {
                    localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID, activeDevice.id);
                }
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
            this.startFetchPlaybackStateInterval();
            return;
        }

        this.stopFetchPlaybackInterval();

        this.setState({
            isPlaying: !playerState.paused,
            progress: playerState.position,
            duration: playerState.duration,
            title: currentTrack.name,
            artist: currentTrack.artists.map(artist => artist.name).join(', '),
            img: currentTrack.album.images[0].url,
            uri: currentTrack.uri,
            isPlayedLocally: true,
        });

        this.toggleProgressInterval();
    }

    startProgressInterval() {
        if (this.progressInterval !== null) this.stopProgressInterval();
        this.setState({ isPlaying: true });
        this.progressInterval = setInterval(() => {
            this.setState({ progress: this.state.progress + 1000 });
            if (this.state.progress >= this.state.duration) {
                this.startFetchPlaybackStateInterval();
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

    updatePlayingDevices(device_id) {
        return spotifyFetch('/me/player', { method: 'PUT', body: JSON.stringify({ device_ids: [device_id] }) })
            .catch(() => setTimeout(() => this.updatePlayingDevices(device_id), 2000));
    }

    fetchPlaybackState() {
        spotifyFetch('/me/player').then(playbackState => {
            if (playbackState) {
                this.setState({
                    isPlaying: playbackState.is_playing,
                    progress: playbackState.progress_ms,
                    duration: playbackState.item.duration_ms,
                    title: playbackState.item.name,
                    artist: playbackState.item.artists.map(artist => artist.name).join(', '),
                    img: playbackState.item.album.images[0].url,
                    uri: playbackState.item.uri,
                    isPlayedLocally: playbackState.device.id === this.localPlayerId,
                    volume: playbackState.device.volume_percent
                });
                this.toggleProgressInterval();
            }
        });
    }

    startFetchPlaybackStateInterval() {
        if (this.playbackStateInterval !== null) clearInterval(this.playbackStateInterval);
        this.playbackStateInterval = setInterval(() => {
            if (this.state.isPlayedLocally) {
                clearInterval(this.playbackStateInterval);
                this.playbackStateInterval = null;
                return;
            }
            this.fetchPlaybackState();
        }, 3000);
    }

    stopFetchPlaybackInterval() {
        if (this.playbackStateInterval !== null) clearInterval(this.playbackStateInterval);
        this.playbackStateInterval = null;
    }

    play() {
        this.player.then(player => player.activateElement());
        this.startProgressInterval();

        spotifyFetch('/me/player/play', { method: 'PUT', body: JSON.stringify({ uris: [this.state.uri], position_ms: this.state.progress }) })
            .then(() => { if (!this.state.isPlayedLocally) setTimeout(() => this.startFetchPlaybackStateInterval(), 3000); });
    }

    pause() {
        this.stopProgressInterval();
        spotifyFetch('/me/player/pause', { method: 'PUT' })
            .then(() => { if (!this.state.isPlayedLocally) setTimeout(() => this.startFetchPlaybackStateInterval(), 3000); });
    }

    togglePlay() {
        if (this.state.isPlaying) this.pause();
        else this.play();
    }

    openDevicesMenu(event) {
        this.getDevices();
        this.setState({ devices: { ...this.state.devices, openMenuAnchor: event.currentTarget } });
    }

    clickOnDeviceItem(newDeviceId) {
        this.pause();
        setTimeout(() => this.updatePlayingDevices(newDeviceId).then(() => {
            localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_CURRENT_DEVICE_ID, newDeviceId);
            this.setState({
                devices: {
                    ...this.state.devices,
                    openMenuAnchor: null
                }
            });
            this.startFetchPlaybackStateInterval();
            setTimeout(() => this.play(), 1000);
        }), 1000);
    }

    updateProgress(newProgress) {
        console.log('update progress');
        let fetchingPlayerStateInterval = this.playbackStateInterval != null;

        this.stopProgressInterval();
        if (fetchingPlayerStateInterval) {
            this.stopFetchPlaybackInterval();
        }

        this.setState({ progress: newProgress });
        spotifyFetch('/me/player/seek?position_ms=' + newProgress, { method: 'PUT' }).then(() => {
            if (this.state.isPlaying) this.startProgressInterval();
            setTimeout(() => {
                if (fetchingPlayerStateInterval) this.startFetchPlaybackStateInterval();
                else this.fetchPlaybackState()
            }, 3000);
        });
    }

    openSpotifyTrack() {
        let uri = this.state.uri.split(":").slice(1, 3).join('/');
        window.open("https://open.spotify.com/" + uri);
    }

    openVolumePopover(event) {
        this.setState({ openVolumePopoverAnchor: event.currentTarget });
    }

    updateVolume(newVolume) {
        this.setState({ volume: newVolume });
        spotifyFetch('/me/player/volume?volume_percent=' + newVolume, { method: 'PUT' })
            .then(() => {
                this.setState({ openVolumePopoverAnchor: null })
            });
    }

    render() {
        const isDevicesMenuOpen = Boolean(this.state.devices.openMenuAnchor);
        const isVolumePopoverOpen = Boolean(this.state.openVolumePopoverAnchor);
        const { classes } = this.props;
        return (
            <Slide direction="up" in={this.state.title.length > 1} mountOnEnter unmountOnExit>
                <Box className={classes.root}>
                    <Box className={classes.shape}>
                        <Box className={classes.content}>

                            <Box className={classes.leftControls}>
                                <CardMedia className={classes.albumCardMedia} image={this.state.img}>
                                    <Box className={classes.albumCardMediaControls}>
                                        <IconButton className={classes.albumMediaCardBtn} size='small' onClick={() => this.openSpotifyTrack()}>
                                            <KeyboardArrowUpRounded sx={{ fontSize: '28px', color: 'white' }} />
                                        </IconButton>
                                    </Box>
                                </CardMedia>
                            </Box>

                            <Box className={classes.mediaData}>
                                <Typography variant='body2' noWrap >{this.state.title}</Typography>
                                <Typography variant='caption' noWrap >{this.state.artist}</Typography>
                                <Slider size="small" color='secondary'
                                    value={this.state.progress} min={0} max={this.state.duration}
                                    onChange={(event, value) => this.setState({ progress: value })}
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
                                <IconButton size='small' sx={{ color: 'white' }}
                                    aria-controls={isVolumePopoverOpen ? 'volumePopover' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={isVolumePopoverOpen ? 'true' : undefined}
                                    onClick={event => this.openVolumePopover(event)}
                                >
                                    <VolumeUpRounded sx={{ color: 'white' }} />
                                </IconButton>
                                <IconButton size='small' sx={{ color: 'white' }} onClick={() => this.togglePlay()}>
                                    {this.state.isPlaying
                                        ? <PauseRounded sx={{ color: 'white' }} />
                                        : <PlayArrowRounded sx={{ color: 'white' }} />
                                    }
                                </IconButton>

                                {this.devicesMenuRender()}
                                {this.popupVolumeRender()}
                            </Box>

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
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    },
                }}
                transformOrigin={{ horizontal: 'top', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                {this.state.devices.list && this.state.devices.list.map(device =>
                    <MenuItem dense key={device.id} onClick={() => this.clickOnDeviceItem(device.id)}>
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

export default withStyles(styles)(Player);
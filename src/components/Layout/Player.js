import { ComputerRounded, FavoriteBorderRounded, KeyboardArrowUpRounded, PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import { CardMedia, colors, IconButton, Slide, Slider, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { connect } from 'react-redux';
import { APP_CONST } from '../../constants';
import { fetch as fetchSpotify } from '../../services/SpotifyServices';

const { Component } = require("react");

class Player extends Component {

    state = {
        isPlaying: false,
        progressBarValue: 0,
        progress: 0,
        duration: 1,
        title: '',
        artist: '',
        img: '',
    }

    player = new Promise(resolve => {
        if (window.Spotify) {

            const player = new window.Spotify.Player({
                name: 'mySeed',
                getOAuthToken: cb => { cb(localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)); },
                volume: 0.5
            });

            player.connect().then(isReady => {
                if (isReady) {

                    player.addListener('ready', ({ device_id }) => {

                        fetchSpotify('/me/player').then(playbackState => {
                            if (!playbackState) {
                                console.log('fetch playback here');
                                fetchSpotify('/me/player', { method: 'PUT', body: JSON.stringify({ device_ids: [device_id] }) });
                                return;
                            }

                            console.log('Init state');
                            this.setState({
                                isPlaying: playbackState.is_playing,
                                progress: playbackState.progress_ms,
                                duration: playbackState.item.duration_ms,
                                title: playbackState.item.name,
                                artist: playbackState.item.artists.map(artist => artist.name).join(', '),
                                img: playbackState.item.album.images[0].url
                            });
                        });

                        player.addListener('player_state_changed', playerState => {
                            this.updateState(playerState);
                        });

                        resolve(player);

                    });

                }
            });
        }
    });

    intervalPlaybackState = null;
    lastPlayedItemRequested = false;

    componentDidMount() {
        // this.intervalPlaybackState = setInterval(() => {
        //     this.fetchPlaybackState();
        // }, 1000);        
    }

    componentWillUnmount() {
        if (this.intervalPlaybackState) clearInterval(this.intervalPlaybackState);
    }

    componentWillUnmount() {
        this.player.then(player => {
            player.disconnect()
        });
    }

    updateState(playerState) {
        console.log('Update player state : ')
        console.log(playerState);
        const currentTrack = playerState.track_window.current_track;
        this.setState({
            isPlaying: !playerState.paused,
            progress: playerState.position,
            duration: playerState.duration,
            title: currentTrack.name,
            artist: currentTrack.artists.map(artist => artist.name).join(', '),
            img: currentTrack.album.images[0].url,
        })
    }

    // initPlayerIfNotCurrentlyPlaying(device_id) {
    //     // Set playback device 
    //     fetchSpotify('/me/player', { method: 'PUT', body: JSON.stringify({ device_ids: [device_id] }) });

    //     // Init player with last played item
    //     fetchSpotify('/me/player/recently-played?limit=1').then(recentlyPlayed => {
    //         if (recentlyPlayed && recentlyPlayed.items && recentlyPlayed.items[0]) {
    //             const lastPlayedItem = recentlyPlayed.items[0];
    //             this.setState({
    //                 isPlaying: false,
    //                 progress: 0,
    //                 duration: lastPlayedItem.track.duration_ms,
    //                 title: lastPlayedItem.track.name,
    //                 artist: lastPlayedItem.track.artists.map(artist => artist.name).join(', '),
    //                 img: lastPlayedItem.track.album.images[0].url,
    //                 lastPlayedItem: { contextUri: lastPlayedItem.track.uri }
    //             })
    //         }
    //     });
    // }

    // fetchPlaybackState() {
    //     fetchSpotify('/me/player').then(playbackState => {
    //         if (playbackState) {

    //             this.setState({
    //                 isPlaying: playbackState.is_playing,
    //                 progress: playbackState.progress_ms,
    //                 duration: playbackState.item.duration_ms,
    //                 title: playbackState.item.name,
    //                 artist: playbackState.item.artists.map(artist => artist.name).join(', '),
    //                 img: playbackState.item.album.images[0].url
    //             });

    //         } else if (!this.lastPlayedItemRequested) {
    //             this.lastPlayedItemRequested = true;
    //             fetchSpotify('/me/player/recently-played?limit=1').then(recentlyPlayed => {
    //                 if (recentlyPlayed && recentlyPlayed.items && recentlyPlayed.items[0]) {
    //                     const lastPlayedItem = recentlyPlayed.items[0];
    //                     this.setState({
    //                         isPlaying: false,
    //                         progress: 0,
    //                         duration: lastPlayedItem.track.duration_ms,
    //                         title: lastPlayedItem.track.name,
    //                         artist: lastPlayedItem.track.artists.map(artist => artist.name).join(', '),
    //                         img: lastPlayedItem.track.album.images[0].url,
    //                         lastPlayedItem: { contextUri: lastPlayedItem.track.uri }
    //                     })
    //                 }
    //             });
    //         }
    //     });
    // }

    play() {
        this.player.then(player => {
            player.resme()
        });
    }

    pause() {
        this.player.then(player => {
            player.pause()
        });
    }

    togglePlay() {
        this.player.then(player => player.togglePlay());
    }

    render() {
        const { classes } = this.props;
        return (
            <>
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
                                    <Box className={classes.mediaData}>
                                        <Typography variant='body2' noWrap={true}>{this.state.title}</Typography>
                                        <Typography variant='caption' noWrap={true}>{this.state.artist}</Typography>
                                        <Slider size="small" value={this.state.progress} min={0} max={this.state.duration} color='secondary' sx={{ height: 4, padding: '0 !important' }} />
                                    </Box>
                                </Box>

                                <Box className={classes.rightControls}>
                                    <IconButton size='small ' sx={{ color: 'white' }}>
                                        <ComputerRounded sx={{ color: 'white' }} />
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
                                </Box>

                            </Box>
                        </Box>
                    </Box>
                </Slide>
            </>
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
        direction: 'row',
        width: '100%',
    },

    leftControls: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left'
    },
    albumCardMedia: {
        borderRadius: '15px 15px 0 15px',
        height: '84px',
        width: '10vh',
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
        flex: 1,
        justifyContent: 'center',
        color: 'white',
        padding: '8px'
    },

    rightControls: {
        flex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right',
        padding: '15px'
    }

});

const mapStateToProps = state => {
    // const severity = state.app.layout.snackBar.severity;
    // const message = state.app.layout.snackBar.message;
    // const isOpen = state.app.layout.snackBar.isOpen;
    // return { severity, message, isOpen };

    return {};
};

const mapDispatchToProps = dispatch => ({
    // close: () => dispatch({ type: snackBarState.isOpen, isOpen: false })
    // getPlaybaCKState() => dispatch({type: playerState.plac})
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Player));
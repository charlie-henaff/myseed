import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import SpotifyWebPlayer from 'react-spotify-web-playback/lib';
import { APP_CONST } from '../../constants';
import routes from './../../routes';
import AppBar from './AppBar';
import Drawer from './Drawer';
import SnackBar from "./SnackBar";

class Layout extends Component {

    static propTypes = {
        layoutVisible: PropTypes.bool.isRequired,
        spotifyPlayerVisible: PropTypes.bool.isRequired,
        spotfyPlayerUris: PropTypes.array
    };

    render() {
        const { classes, layoutVisible, spotifyPlayerVisible, spotfyPlayerUris } = this.props;
        return (
            <>
                <SnackBar />
                {layoutVisible && (
                    <section>
                        <AppBar />
                        <Drawer />
                    </section>
                )}
                <section className={classes.content} style={{ height: (spotifyPlayerVisible ? '85VH' : '100VH') }}>
                    <Switch>{routes}</Switch>
                </section>
                <section className={classes.footer} style={{ height: (spotifyPlayerVisible ? '15VH' : '0VH') }} >
                    {spotifyPlayerVisible && (
                        <SpotifyWebPlayer
                            name="mySeed"
                            token={localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)}
                            uris={spotfyPlayerUris}
                            play={true}
                            showSaveIcon={true}
                            persistDeviceSelection={false}
                            className={classes.spotifyPlayer}
                            styles={{
                                activeColor: '#fff',
                                bgColor: '#1976d2',
                                color: '#fff',
                                loaderColor: '#fff',
                                sliderColor: '#e91e63',
                                sliderHeight: 8,
                                sliderHandleColor: '#e91e63',
                                trackArtistColor: '#ccc',
                                trackNameColor: '#fff',
                            }} />)}
                </section>
            </>
        );
    }
}

const styles = (theme) => ({
    content: {
        overflow: 'scroll'
    },
    footer: {
        backgroundColor: '#1976d2',
    },
    spotifyPlayer: {
        height: '100VH',
    }
});

const mapStateToProps = state => {
    const layoutVisible = state.app.layout.visible;
    const spotifyPlayerVisible = state.app.layout.spotifyPlayer.visible;
    const spotfyPlayerUris = state.app.layout.spotifyPlayer.uris;
    return { layoutVisible, spotifyPlayerVisible, spotfyPlayerUris };
};

export default connect(mapStateToProps, null)(withStyles(styles)(Layout));
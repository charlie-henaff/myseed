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
        spotifyPlayerActive: PropTypes.bool.isRequired
    };

    render() {
        const { layoutVisible , spotifyPlayerActive} = this.props;
        return (
            <>
                <SnackBar />
                {layoutVisible && (
                    <div>
                        <AppBar />
                        <Drawer />
                    </div>
                )}
                <Switch>{routes}</Switch>
                {spotifyPlayerActive && (
                    <SpotifyWebPlayer
                        token={localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)}
                        uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']} />)}
            </>
        );
    }
}

const styles = () => ({

});

const mapStateToProps = state => {
    const layoutVisible = state.app.layout.visible;
    const spotifyPlayerActive = state.app.layout.spotifyPlayerActive
    return { layoutVisible, spotifyPlayerActive };
};

export default connect(mapStateToProps, null)(withStyles(styles)(Layout));
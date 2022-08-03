import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import routes from './../../routes';
import AppBar from './AppBar';
import Drawer from './Drawer';
import Player from './Player';
import SnackBar from "./SnackBar";

class Layout extends Component {

    static propTypes = {
        layoutVisible: PropTypes.bool.isRequired,
        showPlayer: PropTypes.bool.isRequired,
        spotfyPlayerUris: PropTypes.array
    };

    render() {
        const { classes, layoutVisible, showPlayer, spotfyPlayerUris } = this.props;
        return (
            <>
                <SnackBar />

                {layoutVisible && (
                    <section>
                        <AppBar />
                        <Drawer />
                    </section>
                )}

                <section>
                    <div className={classes.content} style={{ paddingBottom: (showPlayer ? '130px' : '0') }}><Switch>{routes}</Switch></div>
                    {showPlayer && <Player />}
                </section>
            </>
        );
    }
}

const styles = (theme) => ({
    content: {
        height: '100vh',
        overflowY: 'auto'
    }
});

const mapStateToProps = state => {
    const layoutVisible = state.app.layout.visible;
    const showPlayer = state.app.layout.spotifyPlayer.visible;
    const spotfyPlayerUris = state.app.layout.spotifyPlayer.uris;
    return { layoutVisible, showPlayer, spotfyPlayerUris };
};

export default connect(mapStateToProps, null)(withStyles(styles)(Layout));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import { withStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { layoutStates } from '../reducers/layout';
import { APP_CONST, history } from "../index";
import { snackBarSeverity, snackBarState } from "../reducers/layout/snackBar";
import bgImg from '../assets/img/woman_looking_through_records_at_vinyl_shop.jpg';
import { store } from '../index';

const spotify_client_scopes = 'user-read-email user-read-private user-library-read user-follow-read user-top-read user-read-recently-played';
const spotify_login_callback = process.env.REACT_APP_BASE_URL+'/login';

class LoginComponent extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        showError: PropTypes.func.isRequired,
        retry: PropTypes.bool
    };

    componentDidMount() {
        const { location, showError } = this.props;
        store.dispatch({ type: layoutStates.VISIBLE, visible: false });
        store.dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: true });

        const { retry } = this.props;
        if (retry) spotifyAuthorize();

        const getterParams = extractGetters(location.search.substring(1));
        if (getterParams.code) spotifyGetToken(getterParams.code, showError);

        const isLoggedIn = localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN);
        if (isLoggedIn) history.push('/');
    }

    render() {
        const { classes } = this.props;
        return (
            <Container maxWidth={false} className={classes.root}>
                <Dialog open={true} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Connexion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Vous devez vous connecter avec votre compte Spotify pour pouvoir
                            profiter de ce service.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={spotifyAuthorize} color="primary">Se connecter</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }
}

const extractGetters = (getterString) => {
    return getterString.split('&').reduce(
        function (initial, item) {
            if (item) {
                const parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {});
};

const spotifyAuthorize = () => {
    window.location = 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.REACT_APP_SPOTIFY_CLIENT_ID +
        '&scope=' + encodeURIComponent(spotify_client_scopes) +
        '&redirect_uri=' + encodeURIComponent(spotify_login_callback);
};

const spotifyGetToken = (code, showError) => {

    const header = {
        'Authorization': `Basic ${btoa(`${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(spotify_login_callback)}`;

    fetch('https://accounts.spotify.com/api/token', { method: 'post', headers: header, body: body })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN, data.access_token);
            localStorage.setItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_REFRESH_TOKEN, data.refresh_token);
            history.push('/');
        });
};

const styles = theme => ({
    root: {
        height: '100vh',
        backgroundImage: 'url(' + bgImg + ')',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'

    }
});

const mapDispatchToProps = dispatch => ({
    showError: (msg) => {
        dispatch({ type: snackBarState.severity, severity: snackBarSeverity.error });
        dispatch({ type: snackBarState.message, message: msg });
        dispatch({ type: snackBarState.isOpen, isOpen: true });
    },
});

export default connect(null, mapDispatchToProps)(
    withStyles(styles)(LoginComponent),
);
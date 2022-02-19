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
import { layoutStates } from '../redux/reducers/layout';
import { snackBarSeverity, snackBarState } from "../redux/reducers/layout/snackBar";
import bgImg from '../assets/img/woman_looking_through_records_at_vinyl_shop.jpg';
import store from '../redux/store';
import history from '../history';
import * as SpotifyServices from '../services/SpotifyServices';
import { logged } from '../services/LoginServices';
import { APP_CONST } from '..';

class LoginComponent extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        showError: PropTypes.func.isRequired,
        retry: PropTypes.bool
    };

    componentDidMount() {
        const { location } = this.props;
        store.dispatch({ type: layoutStates.VISIBLE, visible: false });
        store.dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: true });

        const { retry } = this.props;
        if (retry) SpotifyServices.auth();

        const getterParams = extractGetters(location.search.substring(1));

        if (logged()) history.push('/');
        else if (getterParams.code) SpotifyServices.getToken(getterParams.code).then(() => history.push('/'));
        else if (localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_REFRESH_TOKEN)) SpotifyServices.refreshToken().then(() => history.push(location.state.from.pathname || '/'));
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
                        <Button onClick={SpotifyServices.auth} color="primary">Se connecter</Button>
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
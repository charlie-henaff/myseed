import React from "react";
import { connect } from "react-redux"
import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import { snackBarSeverity, snackBarState } from "../../redux/reducers/layout/snackBar";
import MuiAlert from '@mui/material/Alert';
import { withStyles } from '@mui/styles';

const { Component } = require("react");

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class SnackBar extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        severity: PropTypes.string,
        message: PropTypes.string,
        isOpen: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired,
    }

    render() {
        const { classes, severity, message, isOpen, close } = this.props;

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            close();
        };

        return (
            <Snackbar className={classes.root} open={isOpen} onClose={handleClose}
                message={severity === snackBarSeverity.default && message}
                autoHideDuration={6000}>
                {severity !== snackBarSeverity.default &&
                    <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                        {message}
                    </Alert>}
            </Snackbar>

        );
    }
}

const styles = theme => ({
    root: {
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            left: 8,
            top: null,
            right: 8,
            bottom: 8,
        }
    }
})

const mapStateToProps = state => {
    const severity = state.app.layout.snackBar.severity;
    const message = state.app.layout.snackBar.message;
    const isOpen = state.app.layout.snackBar.isOpen;
    return { severity, message, isOpen };
};

const mapDispatchToProps = dispatch => ({
    close: () => dispatch({ type: snackBarState.isOpen, isOpen: false })
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SnackBar));

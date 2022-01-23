import React, {Component} from 'react';
import {connect} from 'react-redux';
import AppBar from './AppBar';
import Drawer from './Drawer';
import PropTypes from 'prop-types';
import SnackBar from "./SnackBar";
import routes from './../../routes';
import {Switch} from 'react-router-dom';
import { withStyles } from '@mui/styles';

class Layout extends Component {

    static propTypes = {
        layoutVisible: PropTypes.bool.isRequired,
    };

    render() {
        const {layoutVisible} = this.props;
        return (
            <>
                <SnackBar/>
                {layoutVisible && (
                    <div>
                        <AppBar/>
                        <Drawer/>
                    </div>
                )}
                <Switch>{routes}</Switch>
            </>
        );
    }
}

const styles = () => ({

});

const mapStateToProps = state => {
    const layoutVisible = state.app.layout.visible;
    return {layoutVisible};
};

export default connect(mapStateToProps, null)(withStyles(styles)(Layout));
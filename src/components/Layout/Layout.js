import React, {Component} from 'react';
import {connect} from 'react-redux';
import AppBar from './AppBar';
import Drawer from './Drawer';
import PropTypes from 'prop-types';
import SnackBar from "./SnackBar";
import routes from './../../routes';
import {Switch} from 'react-router-dom';
import { withStyles } from '@mui/styles';
import bgImg from '../../assets/img/woman_looking_through_records_at_vinyl_shop.jpg';

class Layout extends Component {

    static propTypes = {
        layoutVisible: PropTypes.bool.isRequired,
    };

    render() {
        const {layoutVisible, fullSizeBgImg, classes} = this.props;
        return (
            <div className={fullSizeBgImg && classes.rootFullSizeBgImg}>
                <SnackBar/>
                {layoutVisible && (
                    <div>
                        <AppBar/>
                        <Drawer/>
                    </div>
                )}
                <Switch>{routes}</Switch>
            </div>
        );
    }
}

const styles = () => ({
    rootFullSizeBgImg: {
      height: '100vh',
      backgroundImage: 'url(' + bgImg + ')',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover'
  }
});

const mapStateToProps = state => {
    const layoutVisible = state.app.layout.visible;
    return {layoutVisible};
};

export default connect(mapStateToProps, null)(withStyles(styles)(Layout));
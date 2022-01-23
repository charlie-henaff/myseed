import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import React, {Component} from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/styles';
import {HomeRounded as HomeIcon} from '@mui/icons-material';
import {connect} from 'react-redux';
import {drawerStates} from '../../reducers/layout/drawer';
import {APP_CONST, history} from '../../index';
import PropTypes from 'prop-types';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

class Drawer extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  render() {
    const {classes, open, toggle} = this.props;

    const changeDestination = (destination) => {
      history.push( );
      toggle(false);
    };

    const disconect = () => {
      localStorage.removeItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN);
      changeDestination('/login');
    };

    return (
        <SwipeableDrawer
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            anchor="left"
            open={open}
            onOpen={() => toggle(true)}
            onClose={() => toggle(false)}>
          <Box bgcolor="primary.main"
               color="primary.contrastText"
               className={classes.header}>
            <Typography variant="h6" gutterBottom={true}>
              MySeed
            </Typography>
            <Button variant="outlined" color="inherit" onClick={disconect}>
              Déconnexion
            </Button>
          </Box>
          <List className={classes.menu}>
            <ListItem button key="drawer_home" onClick={() => changeDestination('/')}>
              <ListItemIcon><HomeIcon color="inherit"/></ListItemIcon>
              <ListItemText primary="Accueil"/>
            </ListItem>
          </List>
        </SwipeableDrawer>
    );
  }
}

const styles = theme => ({
  header: {
    height: 275,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
  },
  menu: {
    width: 250,
  },
});

const mapStateToProps = state => {
  const open = state.app.layout.drawer.open;
  return {open};
};

const mapDispatchToProps = dispatch => ({
  toggle: open => dispatch({type: drawerStates.OPEN, open: open}),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(Drawer));
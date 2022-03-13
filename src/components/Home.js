import React, {Component} from 'react';
import { withStyles } from '@mui/styles';
import {connect} from 'react-redux';
import {APP_CONST} from '../constants';
import {layoutStates} from "../redux/reducers/layout";
import { Box } from '@mui/system';
import store from '../redux/store';
import history from '../history';
class Home extends Component {

  componentDidMount() {
    if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
      history.push('/login');
    }

    history.push('/music/playlist');

    store.dispatch({ type: layoutStates.VISIBLE, visible: true });
    store.dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: false });
  }

  render() {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" pt={8}>
        
      </Box>
    );
  }
}

const styles = (theme) => ({
  
});

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
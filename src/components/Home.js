import React, {Component} from 'react';
import { withStyles } from '@mui/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {APP_CONST, history} from '../index';
import {layoutStates} from "../reducers/layout";
import { Box } from '@mui/system';
import {store} from '../index';
class Home extends Component {
  static propTypes = {
    token: PropTypes.string,
  };

  componentDidMount() {
    if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
      history.push('/login');
    }

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
  const token = state.app.token;
  return {token};
};

const mapDispatchToProps = dispatch => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
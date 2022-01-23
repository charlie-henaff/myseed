import React, {Component} from 'react';
import { withStyles } from '@mui/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {APP_CONST, history} from '../index';
import {layoutStates} from "../reducers/layout";
import { Box } from '@mui/system';

class Home extends Component {
  static propTypes = {
    token: PropTypes.string,
    showLayout: PropTypes.func.isRequired,
    fullSizeContent: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
      history.push('/login');
    }

    const {showLayout, fullSizeContent} = this.props;
    showLayout(true);
    fullSizeContent(false);
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
  showLayout: (bool) => dispatch({type: layoutStates.VISIBLE, visible: bool}),
  fullSizeContent: (bool) => dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: bool }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
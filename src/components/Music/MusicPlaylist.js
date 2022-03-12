import React, { Component } from 'react';
import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { APP_CONST } from '../../constants';
import { layoutStates } from "../../redux/reducers/layout";
import { Box } from '@mui/system';
import store from '../../redux/store';
import history from '../../history';
import { Container, LinearProgress } from '@mui/material';
import { musicPlaylistStates } from '../../redux/reducers/music/playlist';


class MusicPlaylist extends Component {

  static propTypes = {
    playlistLoading: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
      history.push('/login');
    }

    store.dispatch({ type: layoutStates.VISIBLE, visible: true });
    store.dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: false });
    store.dispatch({ type: musicPlaylistStates.LOADING, loading: true });
  }

  render() {
    const { playlistLoading } = this.props;

    return (
      <>
        {playlistLoading && <LinearProgress color="secondary" />}
        <Container maxWidth={'xl'}>
          {/* {!tracks ? "" : (
            <Box py={2}>
              <Typography variant="h6" gutterBottom>Musiques</Typography>
              <Grid container spacing={2}>
                {tracks.map(item => {
                  return <Artist name={item.name} avatarUrl={item.album?.images?.pop()?.url} key={"artist_" + item.id} />
                })}
              </Grid>
            </Box>
          )} */}
        </Container>
      </>
    );
  }
}

const styles = (theme) => ({

});

const mapStateToProps = state => {
  const playlistLoading = state.app.music.playlist.loading;
  const playlistResult = state.app.music.playlist.result;
  const playlistError = state.app.music.playlist.error;
  return { playlistLoading, playlistResult, playlistError };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MusicPlaylist));
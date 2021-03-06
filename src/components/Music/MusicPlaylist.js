import { Container, Grid, LinearProgress, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { APP_CONST } from '../../constants';
import history from '../../history';
import { layoutStates } from "../../redux/reducers/layout";
import { spotifyPlayerState } from '../../redux/reducers/layout/spotifyPlayer';
import { musicPlaylistStates } from '../../redux/reducers/music/playlist';
import store from '../../redux/store';
import { topsRecommendations } from '../../services/music/MusicPlaylistServices';
import Artist from '../Util/Card/Artist';


class MusicPlaylist extends Component {

  static propTypes = {
    playlistLoading: PropTypes.bool,
    tracks: PropTypes.array,
  };

  state = { 
    lastTracks: null 
  };

  componentDidMount() {
    if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
      history.push('/login');
    }

    store.dispatch({ type: layoutStates.VISIBLE, visible: true });
    store.dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: false });

    const { tracks } = this.props;
    if (!tracks) {
      getTopRecomendations()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { tracks } = this.props;
    if (tracks !== prevProps.tracks) {
      store.dispatch({ type: spotifyPlayerState.VISIBLE, visible: true });
      store.dispatch({ type: spotifyPlayerState.URIS, uris: tracks.map(track => track.uri) });
    }
  }

  render() {
    const { playlistLoading, tracks } = this.props;

    return (
      <>
        {playlistLoading && <LinearProgress color="secondary" />}
        <Container maxWidth={'xl'}>
          {!tracks ? "" : (
            <Box py={2}>
              <Typography variant="h6" gutterBottom>My playlist</Typography>
              <Grid container spacing={2}>
                {tracks.map(item => {
                  return <Artist name={item.name} avatarUrl={item.album?.images?.pop()?.url} key={"artist_" + item.id} />
                })}
              </Grid>
            </Box>
          )}
        </Container>
      </>
    );
  }
}

const styles = (theme) => ({

});

const getTopRecomendations = () => {
  store.dispatch({ type: musicPlaylistStates.LOADING, loading: true });
  topsRecommendations()
    .then(result => store.dispatch({ type: musicPlaylistStates.RESULT, result: result.tracks }))
    .finally(() => store.dispatch({ type: musicPlaylistStates.LOADING, loading: false }))
    .catch(error => {
      if (error.message) {
        store.dispatch({ type: musicPlaylistStates.ERROR, error: (error.message || "Une erreur est survenue.") });
      }
    });;
};

const mapStateToProps = state => {
  const playlistLoading = state.app.music.playlist.loading;
  const tracks = state.app.music.playlist.result;
  const playlistError = state.app.music.playlist.error;
  return { playlistLoading, tracks, playlistError };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MusicPlaylist));

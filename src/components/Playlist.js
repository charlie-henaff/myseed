import { Container, Grid, LinearProgress } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { APP_CONST } from '../constants';
import history from '../history';
import { layoutStates } from "../redux/reducers/layout";
import { appBarStates } from '../redux/reducers/layout/appBar';
import { playerState } from '../redux/reducers/layout/player';
import { playlistStates } from '../redux/reducers/playlist';
import store from '../redux/store';
import { topsRecommendations } from '../services/PlaylistServices';
import { fetch as spotifyFetch } from '../services/SpotifyServices';
import Artist from './Util/Card/Artist';


class Playlist extends Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    tracks: PropTypes.array,
    playing: PropTypes.object,
  };

  componentDidMount() {
    if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
      history.push('/login');
    }

    store.dispatch({ type: layoutStates.VISIBLE, visible: true });
    store.dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: false });
    store.dispatch({ type: appBarStates.TITLE, title: 'Playlist' });

    getTopRecomendations();
  }

  componentDidUpdate(prevProps, prevState) {
    const { tracks } = this.props;
    if (tracks && tracks !== prevProps.tracks) {
      store.dispatch({ type: playerState.VISIBLE, visible: true });
      store.dispatch({ type: playerState.URIS, uris: tracks.map(track => track.uri) });
    }
  }

  componentWillUnmount() {
    store.dispatch({ type: playerState.VISIBLE, visible: false });
  }

  startPLaylistHere(trackIndex) {
    const { tracks } = this.props;
    spotifyFetch('/me/player/play', { method: 'put', body: JSON.stringify({ uris: [tracks[trackIndex].uri] }) });
    store.dispatch({ type: playerState.URIS, uris: tracks.slice(trackIndex + 1).map(track => track.uri) });
  }

  render() {
    const { isLoading, tracks, playing } = this.props;

    return (
      <>
        {isLoading && <LinearProgress color="secondary" />}
        <Container maxWidth={false}>
          {isLoading || !tracks ? "" : (
            <Box py={2}>
              <Grid container spacing={2}>
                {tracks.map((item, index) => {
                  return <Artist
                    name={item.name}
                    avatarUrl={item.album?.images[1].url}
                    key={"artist_" + item.id}
                    onCardClick={() => this.startPLaylistHere(index)}
                    selected={playing && playing.id === item.id}
                  />
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
  store.dispatch({ type: playlistStates.LOADING, loading: true });
  topsRecommendations()
    .then(result => store.dispatch({ type: playlistStates.RESULT, result: result.tracks }))
    .finally(() => store.dispatch({ type: playlistStates.LOADING, loading: false }))
    .catch(error => {
      if (error.message) {
        store.dispatch({ type: playlistStates.ERROR, error: (error.message || "Une erreur est survenue.") });
      }
    });;
};

const mapStateToProps = state => {
  const isLoading = state.app.playlist.loading;
  const tracks = state.app.playlist.result;
  const error = state.app.playlist.error;
  const playing = state.app.layout.player.playing;
  return { isLoading, tracks, error, playing };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Playlist));

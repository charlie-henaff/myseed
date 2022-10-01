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
import { spotifyPlayerState } from '../redux/reducers/layout/spotifyPlayer';
import { playlistStates } from '../redux/reducers/playlist';
import store from '../redux/store';
import { topsRecommendations } from '../services/PlaylistServices';
import { fetch as spotifyFetch } from '../services/SpotifyServices';
import Artist from './Util/Card/Artist';


class Playlist extends Component {

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
    store.dispatch({ type: appBarStates.TITLE, title: 'Playlist' });

    getTopRecomendations();
  }

  componentDidUpdate(prevProps, prevState) {
    const { tracks } = this.props;
    if (tracks && tracks !== prevProps.tracks) {
      store.dispatch({ type: spotifyPlayerState.VISIBLE, visible: true });
      store.dispatch({ type: spotifyPlayerState.URIS, uris: tracks.map(track => track.uri) });
    }
  }

  componentWillUnmount() {
    store.dispatch({ type: spotifyPlayerState.VISIBLE, visible: false });
  }

  startPLaylistHere(trackIndex) {
    spotifyFetch('/me/player/play', { method: 'put', body: JSON.stringify({ uris: [this.props.tracks[trackIndex].uri] }) });

    // NOT WORKING : Cannot manage queue properly
    // let timeout = 1000;
    // this.props.tracks.slice(trackIndex + 1).forEach(track => {
    //   setTimeout(() => fetchSpotify('/me/player/queue?uri=' + track.uri, { method: 'POST' }), timeout);
    //   timeout = timeout + 1000;
    // });
  }

  render() {
    const { playlistLoading, tracks } = this.props;

    return (
      <>
        {playlistLoading && <LinearProgress color="secondary" />}
        <Container maxWidth={'xl'}>
          {playlistLoading || !tracks ? "" : (
            <Box py={2}>
              <Grid container spacing={2}>
                {tracks.map((item, index) => {
                  return <Artist name={item.name} avatarUrl={item.album?.images[1].url} key={"artist_" + item.id} onCardClick={() => this.startPLaylistHere(index)} />
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
  const playlistLoading = state.app.playlist.loading;
  const tracks = state.app.playlist.result;
  const playlistError = state.app.playlist.error;
  return { playlistLoading, tracks, playlistError };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Playlist));

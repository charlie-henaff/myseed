import { Box, Container, Grid, LinearProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import { withStyles } from '@mui/styles';
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { APP_CONST } from "../constants";
import history from '../history';
import { layoutStates } from "../redux/reducers/layout";
import { appBarStates } from "../redux/reducers/layout/appBar";
import { searchStates } from "../redux/reducers/search";
import store from "../redux/store";
import { search } from "../services/SearchServices";
import Artist from "./Util/Card/Artist";

class Search extends Component {

    static propTypes = {
        dispatchSearch: PropTypes.func.isRequired,
        requestSeach: PropTypes.func.isRequired,
        location: PropTypes.object,
        searchInput: PropTypes.string,
        searchLoading: PropTypes.bool,
        searchResult: PropTypes.object,
        searchError: PropTypes.string
    }

    componentDidMount() {
        if (!localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)) {
            history.push('/login');
        }

        store.dispatch({ type: layoutStates.VISIBLE, visible: true });
        store.dispatch({ type: layoutStates.FULL_SIZE_CONTENT, fullSizeContent: false });

        const { searchInput, location, dispatchSearch, requestSeach } = this.props;
        const urlSearch = location.pathname.split("/").pop();
        if (urlSearch !== undefined && searchInput !== urlSearch) {
            dispatchSearch(urlSearch);
        } else {
            if (searchInput.length === 0) history.push('/')
            else requestSeach(searchInput);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevSearchInput = prevProps.searchInput;
        const { searchInput, requestSeach } = this.props;
        if (searchInput.length === 0) history.push('/')
        else if (prevSearchInput !== searchInput) requestSeach(searchInput);
    }

    render() {
        const { searchLoading, searchResult } = this.props;
        const artists = searchResult && searchResult.artists.items;
        const albums = searchResult && searchResult.albums.items;
        const tracks = searchResult && searchResult.tracks.items;

        return (
            <>
                {searchLoading && <LinearProgress color="secondary" />}
                <Container maxWidth={'xl'}>
                    {!artists ? "" : (
                        <Box py={2}>
                            <Typography variant="h6" gutterBottom>Artistes</Typography>
                            <Grid container spacing={2}>
                                {artists.map(item => {
                                    return <Artist name={item.name} avatarUrl={item.images[1]?.url} key={"artist_" + item.id} />
                                })}
                            </Grid>
                        </Box>
                    )}
                    {!albums ? "" : (
                        <Box py={2}>
                            <Typography variant="h6" gutterBottom>Albums</Typography>
                            <Grid container spacing={2}>
                                {albums.map(item => {
                                    return <Artist name={item.name} avatarUrl={item.images[1]?.url} key={"artist_" + item.id} />
                                })}
                            </Grid>
                        </Box>
                    )}
                    {!tracks ? "" : (
                        <Box py={2}>
                            <Typography variant="h6" gutterBottom>Musiques</Typography>
                            <Grid container spacing={2}>
                                {tracks.map(item => {
                                    return <Artist name={item.name} avatarUrl={item.album?.images[1]?.url} key={"artist_" + item.id} />
                                })}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </>
        );
    }
}

const styles = (theme) => {

};

const actionSeach = (dispatch, input) => {
    dispatch({ type: searchStates.LOADING, loading: true });
    search(input)
        .then(result => dispatch({ type: searchStates.RESULT, result: result }))
        .finally(() => dispatch({ type: searchStates.LOADING, loading: false }))
        .catch(error => {
            if (error.message) {
                dispatch({ type: searchStates.ERROR, error: (error.message || "Une erreur est survenue.") });
            }
        });
}

const mapStateToProps = state => {
    const searchInput = state.app.layout.appBar.search;
    const searchLoading = state.app.search.loading;
    const searchResult = state.app.search.result;
    const searchError = state.app.search.error;
    return { searchInput, searchLoading, searchResult, searchError };
};

const mapDispatchToProps = dispatch => ({
    dispatchSearch: txt => dispatch({ type: appBarStates.SEARCH, search: txt }),
    requestSeach: txt => actionSeach(dispatch, txt)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Search)); 
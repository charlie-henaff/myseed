import React, { Component } from "react";
import { Box, Container, Grid, LinearProgress } from "@mui/material";
import { withStyles } from '@mui/styles';
import { layoutStates } from "../redux/reducers/layout";
import { APP_CONST } from "../index";
import PropTypes from "prop-types";
import { appBarStates } from "../redux/reducers/layout/appBar";
import { searchStates } from "../redux/reducers/search"
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import Artist from "./Util/Card/Artist";
import store from "../redux/store";
import history from '../history';

class SearchResult extends Component {

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
        const artists = searchResult && searchResult.authors;

        const artistGrid = !artists ? "" : (
            <Box py={2}>
                <Typography variant="h5" gutterBottom>Artistes</Typography>
                <Grid container spacing={2}>
                    {artists.map(item => {
                        return <Artist name={item.name} avatarUrl={item.largeImg?.url} key={"artist_" + item.id} />
                    })}
                </Grid>
            </Box>
        )

        return (
            <>
                {searchLoading && <LinearProgress color="secondary" />}
                <Container maxWidth={'xl'}>
                    {artistGrid}
                </Container>
            </>
        );
    }
}

const styles = (theme) => {

};

const actionSeach = (dispatch, input) => {
    const header = {
        'Authorization': `Bearer ${localStorage.getItem(APP_CONST.LOCAL_STORAGE.SPOTIFY_TOKEN)}`,
        'Content-Type': 'application/json'
    }

    dispatch({ type: searchStates.LOADING, loading: true });
    fetch(`${process.env.REACT_APP_SPOTIFY_API_ENDPOINT}/search?q=${input}`, { method: 'get', headers: header })
        .then(response => response.json())
        .then(data => {
            data['error']
                ? dispatch({ type: searchStates.ERROR, error: data['error']['message'] || "Une erreur est survenue." })
                : dispatch({ type: searchStates.RESULT, result: data });
            dispatch({ type: searchStates.LOADING, loading: false });
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SearchResult));
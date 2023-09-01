import { MenuRounded, SearchRounded as SearchIcon } from '@mui/icons-material';
import { Typography, alpha } from '@mui/material';
import MaterialAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Toolbar from '@mui/material/Toolbar';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from "../../history";
import { appBarStates } from "../../redux/reducers/layout/appBar";
import { drawerStates } from '../../redux/reducers/layout/drawer';

class AppBar extends Component {

    static propTypes = {
        searchValue: PropTypes.string,
        title: PropTypes.string,
        toggleDrawer: PropTypes.func.isRequired,
        dispatchSearch: PropTypes.func.isRequired,
        rightComponent: PropTypes.element,
    }

    constructor(props) {
        super(props);
        this.state = {
            searchInput: this.filterKeySearch(props.searchValue),
            searchTimeout: null
        }
    }

    filterKeySearch = searchTxt => {
        switch (searchTxt) {
            case 'my_favorites': return null;
            default: return searchTxt
        }
    }

    getSearchTimeout = () => setTimeout(() => {
        const { dispatchSearch } = this.props;
        const { searchInput } = this.state;
        history.push((searchInput.length > 0) ? '/search/' + searchInput : '/');
        dispatchSearch(searchInput);
    }, 500);

    search = txt => {
        const { searchTimeout } = this.state;
        if (searchTimeout != null) clearTimeout(searchTimeout)
        this.setState({
            searchInput: txt,
            searchTimeout: this.getSearchTimeout()
        });
    }

    render() {
        const { classes, toggleDrawer, title, rightComponent } = this.props;
        const { searchInput } = this.state;

        return (
            <div>
                <MaterialAppBar color="primary" elevation={0} position="fixed" className={classes.root} >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            aria-label="menu"
                            onClick={() => toggleDrawer(true)}>
                            <MenuRounded />
                        </IconButton>
                        <Box className={classes.title} >
                            <Typography>{title}</Typography>
                        </Box>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Rechercher..."
                                className={classes.searchInput}
                                value={searchInput && searchInput}
                                inputProps={{ 'aria-label': 'search', type: 'search' }}
                                onChange={(event) => this.search(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") this.search(event.target.value);
                                }}
                            />
                        </div>
                        {rightComponent}
                    </Toolbar>
                </MaterialAppBar>
                <Toolbar />
            </div>
        );
    }
}

const styles = theme => ({
    root: { flexGrow: 1 },
    title: {
        flexGrow: 1,
        paddingLeft: 16,
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInput: {
        color: 'inherit',
        '& .MuiInputBase-input': {
            color: theme.palette.common.white,
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(6)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '14ch',
                '&:focus': {
                    width: '40ch',
                },
            },
        },
    }
});

const mapStateToProps = state => {
    const searchValue = state.app.layout.appBar.search;
    const title = state.app.layout.appBar.title;
    const rightComponent = state.app.layout.appBar.rightComponent;
    return { searchValue, title, rightComponent};
};

const mapDispatchToProps = dispatch => ({
    dispatchSearch: txt => dispatch({ type: appBarStates.SEARCH, search: txt }),
    toggleDrawer: open => dispatch({ type: drawerStates.OPEN, open: open }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(AppBar));
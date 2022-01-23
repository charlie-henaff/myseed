import React, { Component } from 'react';
import { withStyles } from '@mui/styles';
import MaterialAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { SearchRounded as SearchIcon } from '@mui/icons-material';
import InputBase from '@mui/material/InputBase';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { drawerStates } from '../../reducers/layout/drawer';
import { appBarStates } from "../../reducers/layout/appBar";
import { history } from "../../index";
import { alpha } from '@mui/system';

class AppBar extends Component {

  static propTypes = {
    searchValue: PropTypes.string,
    toggleDrawer: PropTypes.func.isRequired,
    dispatchSearch: PropTypes.func.isRequired,
  }

  render() {
    const { classes, searchValue, toggleDrawer, dispatchSearch } = this.props;
    const search = txt => {
      history.push((txt.length > 0) ? '/search/' + txt : '/');
      dispatchSearch(txt)
    }
    return (
      <div>
        <MaterialAppBar color="primary" elevation={0} position="fixed" className={classes.root} >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              aria-label="menu"
              onClick={() => toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Box className={classes.title} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Rechercher..."
                className={classes.searchInput}
                value={searchValue && searchValue}
                inputProps={{ 'aria-label': 'search' }}
                onChange={(event) => search(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") search(event.target.value);
                }}
              />
            </div>
          </Toolbar>
        </MaterialAppBar>
        <Toolbar />
      </div>
    );
  }
}

const styles = theme => ({
  root: { flexGrow: 1 },
  title: { flexGrow: 1 },
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
  return { searchValue };
};

const mapDispatchToProps = dispatch => ({
  dispatchSearch: txt => dispatch({ type: appBarStates.SEARCH, search: txt }),
  toggleDrawer: open => dispatch({ type: drawerStates.OPEN, open: open }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(AppBar));
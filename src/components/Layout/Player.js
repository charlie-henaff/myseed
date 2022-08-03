import { KeyboardArrowUpRounded, PlayCircleRounded } from '@mui/icons-material';
import { CardMedia, colors, IconButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Box } from '@mui/system';
import Overlay from '../Util/Overlay';

const { Component } = require("react");

class Player extends Component {


    render() {
        const { classes } = this.props;
        return (
            <Box className={classes.root}>
                <Box className={classes.shape}>
                    <Box className={classes.controls}>
                        <Box className={classes.rightControls}>
                            <CardMedia className={classes.albumCardMedia} image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.xddyM5Z5llwe5nz0xAnhvAHaD_%26pid%3DApi&f=1">
                                <Overlay className={classes.albumCardMediaOverlay} />
                                <Box className={classes.albumCardMediaControls}>
                                    <IconButton className={classes.albumMediaCardBtn} size='small'>
                                        <KeyboardArrowUpRounded sx={{ fontSize: '28px', color: 'white' }} />
                                    </IconButton>
                                </Box>
                            </CardMedia>
                        </Box>
                        <Box className={classes.centralControls}>
                            <IconButton sx={{ color: 'white' }}>
                                <PlayCircleRounded sx={{ fontSize: '44px', color: 'white' }} />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}

const styles = (theme) => ({
    root: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        textAlign: 'center',
    },
    shape: {
        // background: theme.palette.primary.main,
        boxShadow: '0 15px 25px rgba(129, 124, 124, 0.2)',
        backdropFilter: 'blur(14px)',
        backgroundColor: 'rgba(25, 118, 210, 0.5)',
        borderRadius: '15px',
        margin: '5px 10px'
    },
    controls: {
        display: 'flex',
        direction: 'row',
        width: '100%'
    },
    albumCardMedia: {
        borderRadius: '15px 15px 0 15px',
        height: '100%',
        width: '10vh',
    },
    albumCardMediaOverlay: {
        color: colors.grey["900"],
        opacity: 0.4,
        position: 'relative',
        borderRadius: '15px 15px 0 15px',
    },
    albumCardMediaControls: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    albumMediaCardBtn: {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    centralControls: {
        flexGrow: 1,
        textAlign: 'center'
    }

});

export default withStyles(styles)(Player);
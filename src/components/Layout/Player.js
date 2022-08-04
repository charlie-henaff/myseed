import { ComputerRounded, FavoriteBorderRounded, KeyboardArrowUpRounded, PlayArrowRounded } from '@mui/icons-material';
import { CardMedia, colors, IconButton, LinearProgress, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Box } from '@mui/system';

const { Component } = require("react");

class Player extends Component {


    render() {
        const { classes } = this.props;
        return (
            <Box className={classes.root}>
                <Box className={classes.shape}>
                    <Box className={classes.content}>

                        <Box className={classes.leftControls}>
                            <CardMedia className={classes.albumCardMedia} image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.xddyM5Z5llwe5nz0xAnhvAHaD_%26pid%3DApi&f=1">
                                <Box className={classes.albumCardMediaControls}>
                                    <IconButton className={classes.albumMediaCardBtn} size='small'>
                                        <KeyboardArrowUpRounded sx={{ fontSize: '28px', color: 'white' }} />
                                    </IconButton>
                                </Box>
                            </CardMedia>
                            <Box className={classes.mediaData}>
                                <Typography variant='body1'>Title</Typography>
                                <Typography variant='caption'>Artist</Typography>
                                <LinearProgress variant="determinate" value={50} color='secondary' sx={{ mt: 0.5, borderRadius: '20px' }} />
                            </Box>
                        </Box>

                        <Box className={classes.rightControls}>
                            <IconButton size='small ' sx={{ color: 'white' }}>
                                <ComputerRounded sx={{ color: 'white' }} />
                            </IconButton>
                            <IconButton size='small' sx={{ color: 'white' }} >
                                <FavoriteBorderRounded sx={{ color: 'white' }} />
                            </IconButton>
                            <IconButton size='small' sx={{ color: 'white' }}>
                                <PlayArrowRounded sx={{ color: 'white' }} />
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
    },
    shape: {
        boxShadow: '0 15px 25px rgba(129, 124, 124, 0.2)',
        backdropFilter: 'blur(14px)',
        backgroundColor: 'rgba(25, 118, 210, 0.75)',
        borderRadius: '20px',
        margin: '5px 10px'
    },
    content: {
        display: 'flex',
        direction: 'row',
        width: '100%',
    },

    leftControls: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left'
    },
    albumCardMedia: {
        borderRadius: '15px 15px 0 15px',
        height: '72px',
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
    mediaData: {
        flex: 1,
        justifyContent: 'center',
        color: 'white',
        padding: '8px'
    },

    rightControls: {
        flex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right',
        padding: '15px'
    }

});

export default withStyles(styles)(Player);
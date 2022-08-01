import { PlayCircleRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { withStyles } from "@mui/styles";
import { Box } from '@mui/system';

const { Component } = require("react");

class Player extends Component {


    render() {
        const { classes } = this.props;
        return (
            <Box className={classes.shape}>
                <Box className={classes.centralBtns}>
                    <IconButton sx={{color: 'white'}}>
                        <PlayCircleRounded sx={{fontSize: '44px', color: 'white'}}/>
                    </IconButton>
                </Box>
            </Box>
        );
    }
}

const styles = (theme) => ({
    shape: {
        height: '100%',
        marginTop: '5px',
        marginLeft: '10px',
        marginRight: '10px',
        background: theme.palette.primary.main,
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center'
    },
    centralBtns: {
        flexGrow: 1,
        justifyContent: 'center'
    }
});

export default withStyles(styles)(Player);
import { Box, ButtonBase, Card, CardMedia, Typography, colors } from "@mui/material";
import { withStyles } from '@mui/styles';
import PropTypes from "prop-types";
import React, { Component } from "react";
import imgTest from "../../../assets/img/man_listening_music_in_sleeping.jpg";
import AnimatedSoundWaveIcon from "../AnimatedSoundWaveIcon/AnimatedSoundWaveIcon";
import Overlay from "../Overlay";

class Track extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        };
    }

    static propTypes = {
        name: PropTypes.string,
        avatarUrl: PropTypes.string,
        onCardClick: PropTypes.func,
        selected: PropTypes.bool

    };

    render() {
        const { classes } = this.props;
        const { name, avatarUrl, onCardClick, selected } = this.props;
        const { hover } = this.state;

        const setHover = (value) => {
            this.setState({ hover: value });
        };

        return (
            <Card className={classes.root}
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                onClick={onCardClick}>
                <ButtonBase className={classes.button}>
                    <CardMedia className={classes.media} image={avatarUrl ? avatarUrl : imgTest} loading="lazy">
                        <Overlay color={colors.grey["900"]} opacity={!hover ? 0.3 : 0} />
                        {selected && <AnimatedSoundWaveIcon sx={{ width: 34, margin: 8, position: 'absolute', bottom: 0, right: 0 }} />}
                        <Box className={classes.content} p={2}>
                            <Typography variant="overline" className={classes.name}>{name}</Typography>
                        </Box>
                    </CardMedia>
                </ButtonBase>
            </Card>
        );
    }
};

const styles = theme => ({
    root: {
        height: 150
    },
    button: {
        width: "100%",
        height: "100%",
    },
    media: {
        width: "100%",
        height: "100%",
        textAlign: "initial"
    },
    content: {
        position: "absolute",
    },
    name: {
        color: colors.grey["50"],
        fontSize: "larger",
    },
});

export default withStyles(styles)(Track);
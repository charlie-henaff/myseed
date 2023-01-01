import { Box, ButtonBase, Card, CardMedia, colors, Grid, Typography } from "@mui/material";
import { withStyles } from '@mui/styles';
import PropTypes from "prop-types";
import React, { Component } from "react";
import imgTest from "../../../assets/img/man_listening_music_in_sleeping.jpg";
import Overlay from "../Overlay";

class Artist extends Component {

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
    };

    render() {
        const {classes} = this.props;
        const {name, avatarUrl, onCardClick} = this.props;
        const {hover} = this.state;

        const setHover = (value) => {
            this.setState({hover: value});
        };

        return (
            <>
                <Grid item xs={6} sm={4} md={2} xl={1}>
                    <Card className={classes.root}
                          onMouseOver={() => setHover(true)}
                          onMouseOut={() => setHover(false)}
                          onClick={onCardClick}>
                        <ButtonBase className={classes.button}>
                            <CardMedia className={classes.media} image={avatarUrl ? avatarUrl : imgTest}>
                                <Overlay color={colors.grey["900"]} opacity={!hover ? 0.3 : 0}/>
                                <Box className={classes.content} p={2}>
                                    <Typography variant="overline" className={classes.name}>{name}</Typography>
                                </Box>
                            </CardMedia>
                        </ButtonBase>
                    </Card>
                </Grid>
            </>
        );
    }
}

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
    }
});

export default withStyles(styles)(Artist);
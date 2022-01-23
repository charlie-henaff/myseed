import React, {Component} from "react";
import { withStyles } from '@mui/styles';
import PropTypes from "prop-types";

class Overlay extends Component {

    static propTypes = {
        color: PropTypes.string,
        opacity: PropTypes.number,
    }

    render() {
        const {classes} = this.props;
        const {color, opacity} = this.props;
        return (
            <div className={classes.root}
                 style={{
                     background: color,
                     opacity: opacity
                 }}/>
        )
    }
}

const styles = theme => ({
    root: {
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: "100%",
        transition: ".2s ease",
        willChange: "opacity",
    }
});

export default withStyles(styles)(Overlay);
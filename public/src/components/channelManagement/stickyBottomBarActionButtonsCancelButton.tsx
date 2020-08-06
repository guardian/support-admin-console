import React from "react";
import {
  Button,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

const styles = ({}: Theme) =>
  createStyles({
    button: {
      color: "white",
      borderColor: "white",
    },
    text: {
      fontSize: "14px",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
  });

interface StickyBottomBarActionButtonsCancelButtonProps {
  onClick: () => void;
}

const StickyBottomBarActionButtonsCancelButton: React.FC<
  StickyBottomBarActionButtonsCancelButtonProps & WithStyles<typeof styles>
> = ({ classes, onClick }) => {
  return (
    <Button
      variant="outlined"
      className={classes.button}
      startIcon={<CloseIcon />}
      onClick={onClick}
    >
      <Typography className={classes.text}>Cancel</Typography>
    </Button>
  );
};

export default withStyles(styles)(StickyBottomBarActionButtonsCancelButton);

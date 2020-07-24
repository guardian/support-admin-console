import React from "react";
import {
  Button,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";

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

interface StickyBottomBarActionButtonsEditButtonProps {
  onClick: () => void;
}

const StickyBottomBarActionButtonsEditButton: React.FC<
  StickyBottomBarActionButtonsEditButtonProps & WithStyles<typeof styles>
> = ({ classes, onClick }) => {
  return (
    <Button
      variant="outlined"
      className={classes.button}
      startIcon={<EditIcon />}
      onClick={onClick}
    >
      <Typography className={classes.text}>Enter edit mode</Typography>
    </Button>
  );
};

export default withStyles(styles)(StickyBottomBarActionButtonsEditButton);

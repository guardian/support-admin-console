import React from "react";
import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";

const styles = ({}: Theme) =>
  createStyles({
    text: {
      fontSize: "14px",
      fontWeight: 900,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
  });

interface StickyBottomBarStatusProps {
  isInEditMode: boolean;
  isLocked: boolean;
}

const LOCKED_TEXT = "Locked for editing";
const READ_ONLY_MODE_TEXT = "Read only mode";
const EDIT_MODE_TEXT = "Edit mode";

const StickyBottomBarStatus: React.FC<
  StickyBottomBarStatusProps & WithStyles<typeof styles>
> = ({ classes, isInEditMode, isLocked }) => {
  let text = "";
  if (isInEditMode) {
    text = EDIT_MODE_TEXT;
  } else if (isLocked) {
    text = LOCKED_TEXT;
  } else {
    text = READ_ONLY_MODE_TEXT;
  }

  return (
    <div>
      <Typography className={classes.text}>{text}</Typography>
    </div>
  );
};

export default withStyles(styles)(StickyBottomBarStatus);

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
}

const READ_ONLY_MODE_TEXT = "Read only mode";
const EDIT_MODE_TEXT = "Edit mode";

const StickyBottomBarStatus: React.FC<
  StickyBottomBarStatusProps & WithStyles<typeof styles>
> = ({ classes, isInEditMode }) => {
  return (
    <div>
      <Typography className={classes.text}>
        {isInEditMode ? EDIT_MODE_TEXT : READ_ONLY_MODE_TEXT}
      </Typography>
    </div>
  );
};

export default withStyles(styles)(StickyBottomBarStatus);

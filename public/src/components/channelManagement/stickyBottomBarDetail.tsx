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
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
  });

interface StickyBottomBarDetailProps {
  isInEditMode: boolean;
}

const READ_ONLY_MODE_TEXT =
  "— View live and draft tests using the left-hand menu";
const EDIT_MODE_TEXT = "";

const StickyBottomBarDetail: React.FC<
  StickyBottomBarDetailProps & WithStyles<typeof styles>
> = ({ classes, isInEditMode }) => {
  return (
    <div>
      <Typography className={classes.text}>
        {isInEditMode ? EDIT_MODE_TEXT : READ_ONLY_MODE_TEXT}
      </Typography>
    </div>
  );
};

export default withStyles(styles)(StickyBottomBarDetail);

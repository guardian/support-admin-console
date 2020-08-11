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
  selectedTestName?: string;
}

const READ_ONLY_MODE_DEFAULT_TEXT =
  "— View live and draft tests using the left-hand menu";

const StickyBottomBarDetail: React.FC<
  StickyBottomBarDetailProps & WithStyles<typeof styles>
> = ({ classes, isInEditMode, selectedTestName }) => {
  const editModeText =
    selectedTestName === undefined ? "" : `- ${selectedTestName}`;

  return (
    <div>
      <Typography className={classes.text}>
        {isInEditMode ? editModeText : READ_ONLY_MODE_DEFAULT_TEXT}
      </Typography>
    </div>
  );
};

export default withStyles(styles)(StickyBottomBarDetail);

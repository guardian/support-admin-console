import React from "react";
import {
  Button,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";

import VisibilityIcon from "@material-ui/icons/Visibility";

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

interface StickyBottomBarActionButtonsPreviewButtonProps {}

const StickyBottomBarActionButtonsPreviewButton: React.FC<
  StickyBottomBarActionButtonsPreviewButtonProps & WithStyles<typeof styles>
> = ({ classes }) => {
  return (
    <Button
      variant="outlined"
      className={classes.button}
      startIcon={<VisibilityIcon />}
    >
      <Typography className={classes.text}>Preview</Typography>
    </Button>
  );
};

export default withStyles(styles)(StickyBottomBarActionButtonsPreviewButton);

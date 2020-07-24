import React from "react";
import {
  Button,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";

import SaveIcon from "@material-ui/icons/Save";

const styles = ({}: Theme) =>
  createStyles({
    text: {
      fontSize: "14px",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
  });

interface StickyBottomBarActionButtonsSaveButtonProps {
  hasTestSelected: boolean;
  onClick: () => void;
}

const TEST_SELECTED_TEXT = "Save test";
const TEST_NOT_SELECTED_TEXT = "Save changes";

const StickyBottomBarActionButtonsSaveButton: React.FC<
  StickyBottomBarActionButtonsSaveButtonProps & WithStyles<typeof styles>
> = ({ classes, hasTestSelected, onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      disableElevation
      startIcon={<SaveIcon />}
      onClick={onClick}
    >
      <Typography className={classes.text}>
        {hasTestSelected ? TEST_SELECTED_TEXT : TEST_NOT_SELECTED_TEXT}
      </Typography>
    </Button>
  );
};

export default withStyles(styles)(StickyBottomBarActionButtonsSaveButton);

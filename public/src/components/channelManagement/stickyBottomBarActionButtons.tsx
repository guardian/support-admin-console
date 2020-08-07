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
import VisibilityIcon from "@material-ui/icons/Visibility";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";

const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    leftContainer: {},
    rightContainer: {
      "& > * + *": {
        marginLeft: spacing(1),
      },
    },
    button: {
      color: "white",
      borderColor: "white",
    },
    buttonText: {
      fontSize: "14px",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
  });

const SAVE_BUTTON_TEST_SELECTED_TEXT = "Save test";
const SAVE_BUTTON_TEST_NOT_SELECTED_TEXT = "Save changes";

interface StickyBottomBarActionButtonsProps {
  isInEditMode: boolean;
  hasTestSelected: boolean;
  requestLock: () => void;
  save: () => void;
  cancel: () => void;
}

const StickyBottomBarActionButtons: React.FC<
  StickyBottomBarActionButtonsProps & WithStyles<typeof styles>
> = ({ classes, isInEditMode, hasTestSelected, requestLock, save, cancel }) => {
  const CancelButton = () => (
    <Button
      variant="outlined"
      className={classes.button}
      startIcon={<CloseIcon />}
      onClick={cancel}
    >
      <Typography className={classes.buttonText}>Cancel</Typography>
    </Button>
  );

  const PreviewButton = () => (
    <Button
      variant="outlined"
      className={classes.button}
      startIcon={<VisibilityIcon />}
    >
      <Typography className={classes.buttonText}>Preview</Typography>
    </Button>
  );

  const SaveButton = () => (
    <Button
      variant="contained"
      color="primary"
      disableElevation
      startIcon={<SaveIcon />}
      onClick={save}
    >
      <Typography className={classes.buttonText}>
        {hasTestSelected
          ? SAVE_BUTTON_TEST_SELECTED_TEXT
          : SAVE_BUTTON_TEST_NOT_SELECTED_TEXT}
      </Typography>
    </Button>
  );

  const EditButton = () => (
    <Button
      variant="outlined"
      className={classes.button}
      startIcon={<EditIcon />}
      onClick={requestLock}
    >
      <Typography className={classes.buttonText}>Enter edit mode</Typography>
    </Button>
  );
  return (
    <div className={classes.container}>
      <div className={classes.leftContainer}>
        {isInEditMode && <CancelButton />}
      </div>

      <div className={classes.rightContainer}>
        {isInEditMode ? (
          hasTestSelected ? (
            // Edit mode + test selected
            <>
              <PreviewButton />
              <SaveButton />
            </>
          ) : (
            // Edit mode + no test selected
            <SaveButton />
          )
        ) : (
          // Read only mode
          <EditButton />
        )}
      </div>
    </div>
  );
};

export default withStyles(styles)(StickyBottomBarActionButtons);

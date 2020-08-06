import React from "react";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";

import StickyBottomBarActionButtonsEditButton from "./stickyBottomBarActionButtonsEditButton";
import StickyBottomBarActionButtonsPreviewButton from "./stickyBottomBarActionButtonsPreviewButton";
import StickyBottomBarActionButtonsSaveButton from "./stickyBottomBarActionButtonsSaveButton";
import StickyBottomBarActionButtonsCancelButton from "./stickyBottomBarActionButtonsCancelButton";

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
  });

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
  return (
    <div className={classes.container}>
      <div className={classes.leftContainer}>
        {isInEditMode && (
          <StickyBottomBarActionButtonsCancelButton onClick={cancel} />
        )}
      </div>

      <div className={classes.rightContainer}>
        {isInEditMode ? (
          hasTestSelected ? (
            // Edit mode + test selected
            <>
              <StickyBottomBarActionButtonsPreviewButton />
              <StickyBottomBarActionButtonsSaveButton
                onClick={save}
                hasTestSelected={true}
              />
            </>
          ) : (
            // Edit mode + no test selected
            <StickyBottomBarActionButtonsSaveButton
              onClick={save}
              hasTestSelected={false}
            />
          )
        ) : (
          // Read only mode
          <StickyBottomBarActionButtonsEditButton onClick={requestLock} />
        )}
      </div>
    </div>
  );
};

export default withStyles(styles)(StickyBottomBarActionButtons);

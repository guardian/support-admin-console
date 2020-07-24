import React from "react";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";

import StickyBottomBarActionButtonsEditButton from "./stickyBottomBarActionButtonsEditButton";
import StickyBottomBarActionButtonsPreviewButton from "./stickyBottomBarActionButtonsPreviewButton";
import StickyBottomBarActionButtonsSaveButton from "./stickyBottomBarActionButtonsSaveButton";

const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
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
}

const StickyBottomBarActionButtons: React.FC<
  StickyBottomBarActionButtonsProps & WithStyles<typeof styles>
> = ({ classes, isInEditMode, hasTestSelected, requestLock, save }) => {
  return (
    <div className={classes.container}>
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
  );
};

export default withStyles(styles)(StickyBottomBarActionButtons);

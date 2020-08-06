import React from "react";
import {
  Button,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import StickyBottomBarStatus from "./stickyBottomBarStatus";
import StickyBottomBarDetail from "./stickyBottomBarDetail";
import StickyBottomBarActionButtons from "./stickyBottomBarActionButtons";

const styles = ({ palette, spacing, mixins, typography, transitions }: Theme) =>
  createStyles({
    appBar: {
      top: "auto",
      bottom: 0,
    },
    container: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      padding: `${spacing(2)}px 0`,
      "& > * + *": {
        marginLeft: "4px",
      },
    },
    containerEditMode: {
      background: palette.grey[800],
    },
    containerReadOnlyMode: {
      background: palette.grey[900],
    },
    actionButtonContainer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "100px",
      right: "100px",
      display: "flex",
      alignItems: "center",
    },
  });

interface StickyBottomBarProps {
  isInEditMode: boolean;
  hasTestSelected: boolean;
  requestLock: () => void;
  save: () => void;
  cancel: () => void;
}

const StickyBottomBar: React.FC<
  StickyBottomBarProps & WithStyles<typeof styles>
> = ({ classes, isInEditMode, hasTestSelected, requestLock, save, cancel }) => {
  const containerClasses = [
    classes.container,
    isInEditMode ? classes.containerEditMode : classes.containerReadOnlyMode,
  ].join(" ");

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <div className={containerClasses}>
        <StickyBottomBarStatus isInEditMode={isInEditMode} />
        <StickyBottomBarDetail isInEditMode={isInEditMode} />
      </div>

      <div className={classes.actionButtonContainer}>
        <StickyBottomBarActionButtons
          isInEditMode={isInEditMode}
          hasTestSelected={hasTestSelected}
          requestLock={requestLock}
          save={save}
          cancel={cancel}
        />
      </div>
    </AppBar>
  );
};

export default withStyles(styles)(StickyBottomBar);

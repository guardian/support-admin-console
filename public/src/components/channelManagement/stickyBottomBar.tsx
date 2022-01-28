import React from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { LockStatus } from './helpers/shared';

import StickyBottomBarStatus from './stickyBottomBarStatus';
import StickyBottomBarDetail from './stickyBottomBarDetail';
import StickyBottomBarActionButtons from './stickyBottomBarActionButtons';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    container: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      padding: `${spacing(2)}px 0`,
      '& > * + *': {
        marginLeft: '4px',
      },
    },
    containerEditMode: {
      background: palette.grey[800],
    },
    containerReadOnlyMode: {
      background: palette.grey[900],
    },
    actionButtonContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '100px',
      right: '100px',
      display: 'flex',
      alignItems: 'center',
    },
    helpButtonContainer: {
      position: 'absolute',
      top: '-62px',
      right: '24px',
    },
  });

interface StickyBottomBarProps extends WithStyles<typeof styles> {
  isInEditMode: boolean;
  selectedTestName: string | null;
  editedTestName: string | null;
  lockStatus: LockStatus;
  requestTakeControl: () => void;
  requestLock: () => void;
  save: () => void;
  cancel: () => void;
}

const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  classes,
  isInEditMode,
  selectedTestName,
  editedTestName,
  lockStatus,
  requestTakeControl,
  requestLock,
  save,
  cancel,
}: StickyBottomBarProps) => {
  const containerClasses = [
    classes.container,
    isInEditMode ? classes.containerEditMode : classes.containerReadOnlyMode,
  ].join(' ');

  return (
    <AppBar position="relative" className={classes.appBar}>
      <div className={containerClasses}>
        <StickyBottomBarStatus isInEditMode={isInEditMode} isLocked={lockStatus.locked} />
        <StickyBottomBarDetail
          isInEditMode={isInEditMode}
          editedTestName={editedTestName}
          lockStatus={lockStatus}
        />
      </div>

      <div className={classes.actionButtonContainer}>
        <StickyBottomBarActionButtons
          isInEditMode={isInEditMode}
          selectedTestIsBeingEdited={!!editedTestName && selectedTestName === editedTestName}
          isLocked={lockStatus.locked}
          requestTakeControl={requestTakeControl}
          requestLock={requestLock}
          save={save}
          cancel={cancel}
        />
      </div>
    </AppBar>
  );
};

export default withStyles(styles)(StickyBottomBar);

import * as React from 'react';
import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import StickyBottomBar from './stickyBottomBar';
import { LockStatus } from './helpers/shared';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, typography }: Theme) =>
  createStyles({
    viewTextContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '-50px',
    },
    viewText: {
      fontSize: typography.pxToRem(16),
    },
    body: {
      display: 'flex',
      overflow: 'hidden',
      flexGrow: 1,
      width: '100%',
      height: '100%',
    },
    leftCol: {
      height: '100%',
      overflowY: 'auto',
      background: 'white',
      paddingTop: spacing(6),
      paddingLeft: spacing(6),
      paddingRight: spacing(6),
    },
    rightCol: {
      overflowY: 'auto',
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
    },
  });

interface Props extends WithStyles<typeof styles> {
  sidebar: JSX.Element;
  testEditor: JSX.Element | null;
  selectedTestName?: string;
  editMode: boolean;
  lockStatus: LockStatus;
  requestTakeControl: () => void;
  requestLock: () => void;
  save: () => void;
  cancel: () => void;
}

const TestsFormLayout: React.FC<Props> = ({
  classes,
  sidebar,
  testEditor,
  selectedTestName,
  save,
  cancel,
  editMode,
  requestTakeControl,
  requestLock,
  lockStatus,
}: Props) => {
  return (
    <>
      <div className={classes.body}>
        <div className={classes.leftCol}>{sidebar}</div>

        <div className={classes.rightCol}>
          {testEditor ? (
            testEditor
          ) : (
            <div className={classes.viewTextContainer}>
              <Typography className={classes.viewText}>
                Select an existing test from the menu,
              </Typography>
              <Typography className={classes.viewText}>or create a new one</Typography>
            </div>
          )}
        </div>
      </div>

      <StickyBottomBar
        isInEditMode={editMode}
        selectedTestName={selectedTestName}
        lockStatus={lockStatus}
        requestTakeControl={requestTakeControl}
        requestLock={requestLock}
        save={save}
        cancel={cancel}
      />
    </>
  );
};

export default withStyles(styles)(TestsFormLayout);

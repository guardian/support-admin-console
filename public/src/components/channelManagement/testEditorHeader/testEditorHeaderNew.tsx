import React from 'react';
import {Theme, Typography, makeStyles, Button} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import StickyBottomBarDetail from '../stickyBottomBarDetail';
import {LockStatus} from '../helpers/shared';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import LockIcon from '@material-ui/icons/Lock';
import {TestLockDetails} from './testLockDetails';
import {TestArchiveButton} from './testArchiveButton';
import {TestCopyButton} from './testCopyButton';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: spacing(3),
    paddingRight: spacing(3),
    paddingBottom: spacing(2),
    paddingTop: spacing(1),
    backgroundColor: palette.grey[200],
    borderBottom: `1px solid ${palette.grey[500]}`,
  },
  namesContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  mainHeader: {
    fontSize: '32px',
    fontWeight: 'normal',
  },
  secondaryHeader: {
    fontSize: '14px',
    color: palette.grey[700],
  },
  button: {

  },
  buttonText: {

  },
  lockContainer: {
    alignSelf: 'flex-end',
    display: 'flex',
    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
}));


interface TestEditorHeaderProps {
  name: string;
  nickname?: string;
  lockStatus: LockStatus;
  userHasTestLocked: boolean;
  existingNames: string[];
  existingNicknames: string[];
  onTestLock: (testName: string, force: boolean) => void;
  onTestUnlock: (testName: string) => void;
  onTestSave: (testName: string) => void;
  onTestArchive: () => void;
  onTestCopy: (oldName: string, newName: string, newNickname: string) => void;
}

const TestEditorHeader: React.FC<TestEditorHeaderProps> = ({
  name,
  nickname,
  lockStatus,
  userHasTestLocked,
  existingNames,
  existingNicknames,
  onTestLock,
  onTestUnlock,
  onTestSave,
  onTestArchive,
  onTestCopy,
}: TestEditorHeaderProps) => {
  const classes = useStyles();
  const mainHeader = nickname ? nickname : name;
  const secondaryHeader = nickname ? name : null;

  return (
    <header className={classes.container}>
      <div className={classes.namesContainer}>
        <Typography variant="h2" className={classes.mainHeader}>
          {mainHeader}
        </Typography>
        <Typography className={classes.secondaryHeader}>{secondaryHeader}</Typography>
      </div>
      <div className={classes.lockContainer}>
        {!userHasTestLocked && !lockStatus.locked &&
          <>
            <TestCopyButton
              existingNames={existingNames}
              existingNicknames={existingNicknames}
              sourceName={name}
              sourceNickname={nickname}
              testNamePrefix={undefined}  // TODO
              onTestCopy={onTestCopy}
            />
            <Button
              variant="outlined"
              size="medium"
              startIcon={<EditIcon/>}
              className={classes.button}
              onClick={() => onTestLock(name, false)}
            >
              <Typography className={classes.buttonText}>Edit test</Typography>
            </Button>
          </>
        }
        {!userHasTestLocked && lockStatus.locked &&
          <>
            <TestLockDetails
              email={lockStatus.email}
              timestamp={lockStatus.timestamp}
            />
            <Button
              variant="outlined"
              size="medium"
              startIcon={<LockIcon />}
              className={classes.button}
              onClick={() => onTestLock(name, true)}
            >
              <Typography className={classes.buttonText}>Take control</Typography>
            </Button>
          </>
        }
        {userHasTestLocked &&
          <>
            <TestArchiveButton onTestArchive={onTestArchive}/>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<CloseIcon />}
              className={classes.button}
              onClick={() => onTestUnlock(name)}
            >
              <Typography className={classes.buttonText}>Discard</Typography>
            </Button>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<SaveIcon />}
              className={classes.button}
              onClick={() => onTestSave(name)}
            >
              <Typography className={classes.buttonText}>Save test</Typography>
            </Button>
          </>
        }
      </div>
    </header>
  );
};

export default TestEditorHeader;

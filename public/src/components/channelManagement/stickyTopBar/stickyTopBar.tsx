import React from 'react';
import { Theme, Typography, makeStyles, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { LockStatus } from '../helpers/shared';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import LockIcon from '@material-ui/icons/Lock';
import { TestLockDetails } from './testLockDetails';
import { TestArchiveButton } from './testArchiveButton';
import { TestCopyButton } from './testCopyButton';
import { grey } from '@material-ui/core/colors';
import { Link } from '@material-ui/icons';
import { FrontendSettingsType } from '../../../utils/requests';

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
  secondaryHeaderContainer: {
    display: 'flex',
  },
  secondaryHeader: {
    fontSize: '14px',
    color: palette.grey[700],
  },
  lockContainer: {
    alignSelf: 'flex-end',
    display: 'flex',
    '& > * + *': {
      marginLeft: spacing(2),
    },
    marginLeft: spacing(1),
  },
  buttonText: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: palette.grey[800],
  },
  icon: {
    color: grey[700],
  },
  link: {
    marginLeft: spacing(2),
    padding: '0 8px',
    fontSize: '14px',
    fontWeight: 'normal',
    color: palette.grey[700],
    lineHeight: 1.5,
  },
}));

interface StickyTopBarProps {
  name: string;
  nickname?: string;
  isNew: boolean;
  lockStatus: LockStatus;
  userHasTestLocked: boolean;
  userHasTestListLocked: boolean;
  existingNames: string[];
  existingNicknames: string[];
  testNamePrefix?: string;
  onTestLock: (testName: string, force: boolean) => void;
  onTestUnlock: (testName: string) => void;
  onTestSave: (testName: string) => void;
  onTestArchive: () => void;
  onTestCopy: (oldName: string, newName: string, newNickname: string) => void;
  settingsType: FrontendSettingsType;
}

const StickyTopBar: React.FC<StickyTopBarProps> = ({
  name,
  nickname,
  isNew,
  lockStatus,
  userHasTestLocked,
  userHasTestListLocked,
  existingNames,
  existingNicknames,
  testNamePrefix,
  onTestLock,
  onTestUnlock,
  onTestSave,
  onTestArchive,
  onTestCopy,
  settingsType,
}: StickyTopBarProps) => {
  const classes = useStyles();
  const mainHeader = nickname ? nickname : name;
  const secondaryHeader = nickname ? name : null;

  return (
    <header className={classes.container}>
      <div className={classes.namesContainer}>
        <Typography variant="h2" className={classes.mainHeader}>
          {mainHeader}
        </Typography>
        <div className={classes.secondaryHeaderContainer}>
          <Typography className={classes.secondaryHeader}>{secondaryHeader}</Typography>
          <Button
            className={classes.link}
            variant="outlined"
            startIcon={<Link />}
            onClick={() => {
              navigator.clipboard.writeText(`${location.origin}/${settingsType}/${name}`);
            }}
          >
            Copy link
          </Button>
        </div>
      </div>
      <div className={classes.lockContainer}>
        {!userHasTestLocked && !lockStatus.locked && (
          <>
            <TestCopyButton
              existingNames={existingNames}
              existingNicknames={existingNicknames}
              sourceName={name}
              sourceNickname={nickname}
              testNamePrefix={testNamePrefix}
              onTestCopy={onTestCopy}
              disabled={userHasTestListLocked}
            />
            <Button
              variant="outlined"
              size="medium"
              startIcon={<EditIcon className={classes.icon} />}
              onClick={() => onTestLock(name, false)}
            >
              <Typography className={classes.buttonText}>Edit test</Typography>
            </Button>
          </>
        )}
        {!userHasTestLocked && lockStatus.locked && (
          <>
            <TestLockDetails email={lockStatus.email} timestamp={lockStatus.timestamp} />
            <Button
              variant="outlined"
              size="medium"
              startIcon={<LockIcon className={classes.icon} />}
              onClick={() => onTestLock(name, true)}
            >
              <Typography className={classes.buttonText}>Take control</Typography>
            </Button>
          </>
        )}
        {userHasTestLocked && (
          <>
            {!isNew && <TestArchiveButton onTestArchive={onTestArchive} />}
            <Button
              variant="outlined"
              size="medium"
              startIcon={<CloseIcon className={classes.icon} />}
              onClick={() => onTestUnlock(name)}
            >
              <Typography className={classes.buttonText}>Discard</Typography>
            </Button>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<SaveIcon className={classes.icon} />}
              onClick={() => onTestSave(name)}
            >
              <Typography className={classes.buttonText}>Save test</Typography>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default StickyTopBar;

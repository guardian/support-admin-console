import React from 'react';
import { Theme, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import { LockStatus, Status } from '../helpers/shared';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import HistoryIcon from '@mui/icons-material/History';
import { TestLockDetails } from './testLockDetails';
import { TestArchiveButton } from './testArchiveButton';
import { TestCopyButton } from './testCopyButton';
import { grey } from '@mui/material/colors';
import { Link } from '@mui/icons-material';
import { FrontendSettingsType } from '../../../utils/requests';
import TestLiveSwitch from '../testLiveSwitch';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: spacing(3),
    paddingRight: spacing(3),
    paddingTop: spacing(1),
    backgroundColor: palette.grey[200],
    borderBottom: `1px solid ${palette.grey[500]}`,
  },
  namesContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: spacing(2),
  },
  mainHeader: {
    fontSize: '32px',
    fontWeight: 'normal',
  },
  secondaryHeaderContainer: {
    display: 'flex',
    marginTop: '4px',
  },
  secondaryHeader: {
    fontSize: '14px',
    color: palette.grey[700],
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    paddingBottom: spacing(1),
  },
  switchContainer: {
    alignSelf: 'flex-end',
    display: 'flex',
  },
  lockContainer: {
    alignSelf: 'flex-end',
    display: 'flex',
    '& > * + *': {
      marginLeft: spacing(2),
    },
    marginLeft: spacing(1),
  },
  button: {
    color: palette.grey[800],
    '& > p': {
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: 500,
    },
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
  channel?: string;
  campaignName?: string;
  isNew: boolean;
  status: Status;
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
  onTestAudit: (testName: string, channel?: string) => void;
  onStatusChange: (status: Status) => void;
  settingsType: FrontendSettingsType;
  allowEditing: boolean;
}

const StickyTopBar: React.FC<StickyTopBarProps> = ({
  name,
  nickname,
  channel,
  isNew,
  status,
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
  onTestAudit,
  onStatusChange,
  settingsType,
  allowEditing,
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

      <div className={classes.buttonsContainer}>
        <div className={classes.switchContainer}>
          <TestLiveSwitch
            isLive={status === 'Live'}
            onChange={(isLive: boolean) => onStatusChange(isLive ? 'Live' : 'Draft')}
            disabled={(userHasTestLocked && lockStatus.locked) || !allowEditing} // cannot change test status while still editing it
          />
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
                disabled={userHasTestListLocked || !allowEditing}
              />
              <Button
                className={classes.button}
                variant="outlined"
                size="medium"
                startIcon={<EditIcon className={classes.icon} />}
                onClick={() => onTestLock(name, false)}
                disabled={!allowEditing}
              >
                <Typography>Edit test</Typography>
              </Button>
            </>
          )}
          {!userHasTestLocked && lockStatus.locked && (
            <>
              <TestLockDetails email={lockStatus.email} timestamp={lockStatus.timestamp} />
              <Button
                className={classes.button}
                variant="outlined"
                size="medium"
                startIcon={<LockIcon className={classes.icon} />}
                onClick={() => onTestLock(name, true)}
              >
                <Typography>Take control</Typography>
              </Button>
            </>
          )}
          {userHasTestLocked && (
            <>
              {!isNew && <TestArchiveButton onTestArchive={onTestArchive} />}
              <Button
                className={classes.button}
                variant="outlined"
                size="medium"
                startIcon={<CloseIcon className={classes.icon} />}
                onClick={() => onTestUnlock(name)}
              >
                <Typography>Discard</Typography>
              </Button>
              <Button
                className={classes.button}
                variant="outlined"
                size="medium"
                startIcon={<SaveIcon className={classes.icon} />}
                onClick={() => onTestSave(name)}
              >
                <Typography>Save test</Typography>
              </Button>
            </>
          )}
          <Button
            className={classes.button}
            variant="outlined"
            size="medium"
            startIcon={<HistoryIcon className={classes.icon} />}
            onClick={() => onTestAudit(name, channel)}
          >
            <Typography>Audit</Typography>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default StickyTopBar;

import React from 'react';
import { Theme, Typography, makeStyles, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { LockStatus } from '../helpers/shared';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import LockIcon from '@material-ui/icons/Lock';
import { TestLockDetails } from './CampaignLockDetails';
import { CampaignArchiveButton } from './CampaignArchiveButton';
import { CampaignCopyButton } from './CampaignCopyButton';
import { grey } from '@material-ui/core/colors';

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
}));

interface StickyTopBarProps {
  name: string;
  nickname?: string;
  isNew: boolean;
  lockStatus: LockStatus;
  userHasCampaignLocked: boolean;
  userHasCampaignListLocked: boolean;
  existingNames: string[];
  existingNicknames: string[];
  campaignNamePrefix?: string;
  onCampaignLock: (campaignName: string, force: boolean) => void;
  onCampaignUnlock: (campaignName: string) => void;
  onCampaignSave: (campaignName: string) => void;
  onCampaignArchive: () => void;
  onCampaignCopy: (oldName: string, newName: string, newNickname: string) => void;
}

const StickyTopBar: React.FC<StickyTopBarProps> = ({
  name,
  nickname,
  isNew,
  lockStatus,
  userHasCampaignLocked,
  userHasCampaignListLocked,
  existingNames,
  existingNicknames,
  campaignNamePrefix,
  onCampaignLock,
  onCampaignUnlock,
  onCampaignSave,
  onCampaignArchive,
  onCampaignCopy,
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
        <Typography className={classes.secondaryHeader}>{secondaryHeader}</Typography>
      </div>
      <div className={classes.lockContainer}>
        {!userHasCampaignLocked && !lockStatus.locked && (
          <>
            <CampaignCopyButton
              existingNames={existingNames}
              existingNicknames={existingNicknames}
              // sourceName={name}
              // sourceNickname={nickname}
              // campaignNamePrefix={campaignNamePrefix}
              // onTestCopy={onCampaignCopy}
              // disabled={userHasCampaignListLocked}
              disabled={true}
            />
            <Button
              variant="outlined"
              size="medium"
              startIcon={<EditIcon className={classes.icon} />}
              onClick={() => onCampaignLock(name, false)}
              disabled={true}
            >
              <Typography className={classes.buttonText}>Edit campaign</Typography>
            </Button>
          </>
        )}
        {!userHasCampaignLocked && lockStatus.locked && (
          <>
            <TestLockDetails email={lockStatus.email} timestamp={lockStatus.timestamp} />
            <Button
              variant="outlined"
              size="medium"
              startIcon={<LockIcon className={classes.icon} />}
              onClick={() => onCampaignLock(name, true)}
            >
              <Typography className={classes.buttonText}>Take control</Typography>
            </Button>
          </>
        )}
        {userHasCampaignLocked && (
          <>
            {!isNew && <CampaignArchiveButton onCampaignArchive={onCampaignArchive} />}
            <Button
              variant="outlined"
              size="medium"
              startIcon={<CloseIcon className={classes.icon} />}
              onClick={() => onCampaignUnlock(name)}
              disabled={true}
            >
              <Typography className={classes.buttonText}>Discard</Typography>
            </Button>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<SaveIcon className={classes.icon} />}
              onClick={() => onCampaignSave(name)}
              disabled={true}
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

import React from 'react';
import { Theme, Typography, makeStyles } from '@material-ui/core';
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
  existingNames: string[];
  existingNicknames: string[];
}

const StickyTopBar: React.FC<StickyTopBarProps> = ({
  name,
  nickname,
  existingNames,
  existingNicknames,
}: StickyTopBarProps) => {
  const classes = useStyles();
  const mainHeader = nickname ? nickname : name;
  const secondaryHeader = nickname ? name : null;

  // Purely to stop linting errors during development
  console.log(existingNames, existingNicknames);

  return (
    <header className={classes.container}>
      <div className={classes.namesContainer}>
        <Typography variant="h2" className={classes.mainHeader}>
          {mainHeader}
        </Typography>
        <Typography className={classes.secondaryHeader}>{secondaryHeader}</Typography>
      </div>
      {/*      
      <div className={classes.lockContainer}>
        {!userHasCampaignLocked && !lockStatus.locked && (
          <>
            <CampaignCopyButton
              existingNames={existingNames}
              existingNicknames={existingNicknames}
              disabled={true}
            />
            <Button
              variant="outlined"
              size="medium"
              startIcon={<EditIcon className={classes.icon} />}
              onClick={() => onCampaignLock(name, false)}
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
*/}
    </header>
  );
};

export default StickyTopBar;

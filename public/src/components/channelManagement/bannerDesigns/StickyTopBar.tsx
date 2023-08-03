import React from 'react';
import { Theme, Typography, makeStyles, Button } from '@material-ui/core';
import { BannerDesign } from '../../../models/BannerDesign';
import EditIcon from '@material-ui/icons/Edit';
import { LockDetails } from './LockDetails';
import LockIcon from '@material-ui/icons/Lock';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { grey } from '@material-ui/core/colors';
import { LockStatus } from '../helpers/shared';

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
    justifyContent: 'spaced',
    height: '100%',
  },
  mainHeader: {
    fontSize: '32px',
    fontWeight: 'normal',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    paddingBottom: spacing(1),
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

interface Props {
  name: string;
  onLock: (name: string, force: boolean) => void;
  onUnlock: (name: string) => void;
  onSave: (name: string) => void;
  lockStatus: LockStatus;
  userHasLock: boolean;
}

const StickyTopBar: React.FC<Props> = ({
  name,
  onLock,
  onUnlock,
  onSave,
  userHasLock,
  lockStatus,
}: Props) => {
  const classes = useStyles();

  return (
    <header className={classes.container}>
      <div className={classes.namesContainer}>
        <Typography variant="h2" className={classes.mainHeader}>
          {name}
        </Typography>
      </div>
      <div className={classes.buttonsContainer}>
        <div className={classes.lockContainer}>
          {!userHasLock && !lockStatus.locked && (
            <>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<EditIcon className={classes.icon} />}
                onClick={() => onLock(name, false)}
              >
                <Typography className={classes.buttonText}>Edit test</Typography>
              </Button>
            </>
          )}
          {!userHasLock && lockStatus.locked && (
            <>
              <LockDetails email={lockStatus.email} timestamp={lockStatus.timestamp} />
              <Button
                variant="outlined"
                size="medium"
                startIcon={<LockIcon className={classes.icon} />}
                onClick={() => onLock(name, true)}
              >
                <Typography className={classes.buttonText}>Take control</Typography>
              </Button>
            </>
          )}
          {userHasLock && (
            <>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<CloseIcon className={classes.icon} />}
                onClick={() => onUnlock(name)}
              >
                <Typography className={classes.buttonText}>Discard</Typography>
              </Button>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<SaveIcon className={classes.icon} />}
                onClick={() => onSave(name)}
              >
                <Typography className={classes.buttonText}>Save</Typography>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default StickyTopBar;
import React from 'react';
import {
  Theme,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import { LockDetails } from './LockDetails';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { grey } from '@mui/material/colors';
import { LockStatus } from '../helpers/shared';
import LiveSwitch from '../../shared/liveSwitch';
import { BannerDesign, Status } from '../../../models/bannerDesign';
import { BannerDesignPreview } from './BannerDesignPreview';
import useOpenable from '../../../hooks/useOpenable';
import ArchiveIcon from '@mui/icons-material/Archive';

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
  design: BannerDesign;
  onLock: (name: string, force: boolean) => void;
  onUnlock: (name: string) => void;
  onSave: (name: string) => void;
  onArchive: (designName: string) => void;
  lockStatus: LockStatus;
  userHasLock: boolean;
  onStatusChange: (status: Status) => void;
}

const StickyTopBar: React.FC<Props> = ({
  name,
  design,
  onLock,
  onUnlock,
  onSave,
  onArchive,
  userHasLock,
  lockStatus,
  onStatusChange,
}: Props) => {
  const classes = useStyles();

  const ArchiveButton: React.FC = () => {
    const [isOpen, open, close] = useOpenable();

    return (
      <Tooltip
        title={design.status !== 'Draft' ? 'Design must be in draft status before archiving' : ''}
      >
        <span>
          <Button
            variant="outlined"
            startIcon={<ArchiveIcon style={{ color: grey[700] }} />}
            size="medium"
            onClick={open}
            disabled={design.status !== 'Draft'}
          >
            {/* eslint-disable-next-line react/prop-types */}
            <Typography className={classes.buttonText}>Archive banner design</Typography>
          </Button>
          <Dialog
            open={isOpen}
            onClose={close}
            aria-labelledby="archive-dialog-title"
            aria-describedby="archive-dialog-description"
          >
            <DialogTitle id="archive-dialog-title">Are you sure?</DialogTitle>
            <DialogContent>
              <DialogContentText id="archive-dialog-description">
                Archiving this design will remove it from the banner design tool - you can only
                restore with an engineer&apos;s help.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={close}>
                Cancel
              </Button>
              <Button color="primary" onClick={() => onArchive(name)}>
                Archive design
              </Button>
            </DialogActions>
          </Dialog>
        </span>
      </Tooltip>
    );
  };

  return (
    <header className={classes.container}>
      <div className={classes.namesContainer}>
        <Typography variant="h2" className={classes.mainHeader}>
          {name}
        </Typography>
      </div>
      <div className={classes.buttonsContainer}>
        <div className={classes.switchContainer}>
          <LiveSwitch
            label="Status"
            isLive={design.status === 'Live'}
            onChange={(isLive: boolean) => onStatusChange(isLive ? 'Live' : 'Draft')}
            isDisabled={userHasLock && lockStatus.locked}
          />
        </div>
        <div className={classes.lockContainer}>
          {!userHasLock && !lockStatus.locked && (
            <>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<EditIcon className={classes.icon} />}
                onClick={() => onLock(name, false)}
              >
                <Typography className={classes.buttonText}>Edit design</Typography>
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
              <ArchiveButton />
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
          <BannerDesignPreview design={design} />
        </div>
      </div>
    </header>
  );
};

export default StickyTopBar;

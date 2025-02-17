import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  Theme,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import useOpenable from '../../../hooks/useOpenable';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',

    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',

    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
  onOffLabel: {
    fontSize: '14px',
    fontWeight: 500,
  },
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
}));

interface LiveSwitchProps {
  isLive: boolean;
  onChange: (isLive: boolean) => void;
  disabled: boolean;
}

const TestLiveSwitch: React.FC<LiveSwitchProps> = ({
  isLive,
  onChange,
  disabled,
}: LiveSwitchProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  const onSubmit = () => {
    onChange(!isLive);
    close();
  };

  return (
    <div className={classes.container}>
      <Typography>Status on theguardian.com:</Typography>

      <div className={classes.switchContainer}>
        <Typography className={classes.onOffLabel}>Draft</Typography>
        <Switch checked={isLive} onChange={open} disabled={disabled} />
        <Typography className={classes.onOffLabel}>Live</Typography>

        <Dialog open={isOpen} onClose={close}>
          <div className={classes.dialogHeader}>
            <DialogTitle>Change test status</DialogTitle>
            <IconButton onClick={close} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent dividers>
            {`This will ${
              isLive ? 'disable' : 'enable'
            } this test on the site with immediate effect - are you sure?`}
          </DialogContent>
          <DialogActions>
            <Button onClick={close} color="primary">
              Cancel
            </Button>
            <Button onClick={onSubmit} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default TestLiveSwitch;

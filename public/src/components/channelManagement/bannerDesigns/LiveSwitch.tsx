import React from 'react';
import { makeStyles, Switch, Theme, Typography } from '@material-ui/core';

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

const LiveSwitch: React.FC<LiveSwitchProps> = ({ isLive, onChange, disabled }: LiveSwitchProps) => {
  const classes = useStyles();

  const onSubmit = () => {
    onChange(!isLive);
  };

  return (
    <div className={classes.container}>
      <Typography>Status:</Typography>

      <div className={classes.switchContainer}>
        <Typography className={classes.onOffLabel}>Draft</Typography>
        <Switch checked={isLive} onChange={onSubmit} disabled={disabled} />
        <Typography className={classes.onOffLabel}>Live</Typography>
      </div>
    </div>
  );
};

export default LiveSwitch;

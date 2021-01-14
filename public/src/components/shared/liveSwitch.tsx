import React from 'react';
import { makeStyles, Switch, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',

    '& > * + *': {
      marginLeft: spacing(5),
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
}));

interface LiveSwitchProps {
  isLive: boolean;
  label: string;
  isDisabled: boolean;
  onChange: (isLive: boolean) => void;
}

const LiveSwitch: React.FC<LiveSwitchProps> = ({
  isLive,
  label,
  isDisabled,
  onChange,
}: LiveSwitchProps) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography>{label}</Typography>

      <div className={classes.switchContainer}>
        <Typography className={classes.onOffLabel}>Off</Typography>
        <Switch
          checked={isLive}
          onChange={(e): void => onChange(e.target.checked)}
          disabled={isDisabled}
        />
        <Typography className={classes.onOffLabel}>On</Typography>
      </div>
    </div>
  );
};

export default LiveSwitch;

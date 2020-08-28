import React from 'react';
import { createStyles, withStyles, WithStyles, Switch, Theme, Typography } from '@material-ui/core';

const styles = ({ spacing }: Theme) =>
  createStyles({
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
  });

interface TestEditorLiveSwitchProps extends WithStyles<typeof styles> {
  isChecked: boolean;
  isDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TestEditorLiveSwitch: React.FC<TestEditorLiveSwitchProps> = ({
  classes,
  isChecked,
  isDisabled,
  onChange,
}: TestEditorLiveSwitchProps) => {
  return (
    <div className={classes.container}>
      <Typography>Live on Guardian.com</Typography>

      <div className={classes.switchContainer}>
        <Typography className={classes.onOffLabel}>Off</Typography>
        <Switch checked={isChecked} onChange={onChange} disabled={isDisabled} />
        <Typography className={classes.onOffLabel}>On</Typography>
      </div>
    </div>
  );
};

export default withStyles(styles)(TestEditorLiveSwitch);

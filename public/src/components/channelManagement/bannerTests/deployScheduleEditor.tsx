import React from 'react';
import { makeStyles } from '@mui/styles';
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField, Theme } from '@mui/material';
import { BannerTestDeploySchedule } from '../../../models/banner';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface DeployScheduleEditorProps {
  deploySchedule?: BannerTestDeploySchedule;
  onDeployScheduleChange: (deploySchedule?: BannerTestDeploySchedule) => void;
  isDisabled: boolean;
}

const DeployScheduleEditor: React.FC<DeployScheduleEditorProps> = ({
  deploySchedule,
  onDeployScheduleChange,
  isDisabled,
}: DeployScheduleEditorProps) => {
  const classes = useStyles();

  const defaultValues: BannerTestDeploySchedule = {
    daysBetween: 1,
  };

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'enabled') {
      onDeployScheduleChange(defaultValues);
    } else {
      onDeployScheduleChange(undefined);
    }
  };

  const onSubmit = (data: BannerTestDeploySchedule): void => {
    onDeployScheduleChange(data);
  };

  return (
    <FormControl>
      <div className={classes.container}>
        <RadioGroup value={deploySchedule ? 'enabled' : 'disabled'} onChange={onRadioGroupChange}>
          <FormControlLabel
            value="disabled"
            key="disabled"
            control={<Radio />}
            label="Disabled - use channel deploy schedule"
            disabled={isDisabled}
          />
          <FormControlLabel
            value="enabled"
            key="enabled"
            control={<Radio />}
            label="Enabled - override channel deploy schedule"
            disabled={isDisabled}
          />
        </RadioGroup>

        {deploySchedule && (
          <TextField 
            type={'number'}
            label="Days between deploys"
            disabled={isDisabled}
            InputProps={{ inputProps: { min: 1, step: 1 } }}
            onBlur={event => {
              const daysBetween = parseInt(event.target.value);
              onSubmit({daysBetween});
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
          />
        )}
      </div>
    </FormControl>
  );
};

export { DeployScheduleEditor };

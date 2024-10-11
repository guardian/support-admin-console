import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField, Theme } from '@mui/material';
import { BannerTestDeploySchedule } from '../../../models/banner';
import { useForm } from 'react-hook-form';
import { EMPTY_ERROR_HELPER_TEXT, notNumberValidator } from '../helpers/validation';

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
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const DeployScheduleEditor: React.FC<DeployScheduleEditorProps> = ({
  deploySchedule,
  onDeployScheduleChange,
  onValidationChange,
  isDisabled,
}: DeployScheduleEditorProps) => {
  const classes = useStyles();

  const defaultValues: BannerTestDeploySchedule = {
    daysBetween: 1,
  };
  const { register, errors, handleSubmit } = useForm<BannerTestDeploySchedule>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0 || !deploySchedule;
    onValidationChange(isValid);
  }, [errors.daysBetween]);

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
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
              validate: notNumberValidator,
            })}
            error={errors.daysBetween !== undefined}
            helperText={errors.daysBetween?.message || 'Must be a number'}
            onBlur={handleSubmit(onSubmit)}
            name="daysBetween"
            label="CONTROL"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
            disabled={isDisabled}
          />
        )}
      </div>
    </FormControl>
  );
};

export { DeployScheduleEditor };

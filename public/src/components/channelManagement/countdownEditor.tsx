import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CountdownSettings } from './helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  fieldsContainer: {
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface FormData {
  label: string;
  countdownStartTimestamp: string;
  countdownDeadlineTimestamp: string;
  backgroundColor: string;
  foregroundColor: string;
}

const DEFAULT_COUNTDOWN_SETTINGS: CountdownSettings = {
  label: 'Last chance to claim your 30% discount offer',
  countdownStartTimestamp: '',
  countdownDeadlineTimestamp: '',
  theme: {
    backgroundColor: '#1e3e72',
    foregroundColor: '#ffffff',
  },
};

interface CountdownEditorProps {
  isDisabled: boolean;
  countdownSettings?: CountdownSettings;
  updateCountdownSettings: (updatedCountdownSettings?: CountdownSettings) => void;
  onValidationChange: (isValid: boolean) => void;
}

const CountdownEditor: React.FC<CountdownEditorProps> = ({
  isDisabled,
  countdownSettings,
  updateCountdownSettings,
  onValidationChange,
}: CountdownEditorProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    label: countdownSettings?.label || 'Last chance to claim your 30% discount offer',
    countdownStartTimestamp:
      countdownSettings?.countdownStartTimestamp || new Date().toISOString().slice(0, 19),
    countdownDeadlineTimestamp:
      countdownSettings?.countdownDeadlineTimestamp || new Date().toISOString().slice(0, 19),
    backgroundColor: countdownSettings?.theme.backgroundColor || '#1e3e72',
    foregroundColor: countdownSettings?.theme.foregroundColor || '#ffffff',
  };

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [
    defaultValues.label,
    defaultValues.countdownStartTimestamp,
    defaultValues.countdownStartTimestamp,
    defaultValues.backgroundColor,
    defaultValues.foregroundColor,
  ]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [
    errors.label,
    errors.countdownStartTimestamp,
    errors.countdownDeadlineTimestamp,
    errors.backgroundColor,
    errors.foregroundColor,
  ]);

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    updateCountdownSettings(isChecked ? DEFAULT_COUNTDOWN_SETTINGS : undefined);
  };
  const onSubmit = ({
    label,
    countdownStartTimestamp,
    countdownDeadlineTimestamp,
    backgroundColor,
    foregroundColor,
  }: FormData): void => {
    countdownSettings &&
      updateCountdownSettings({
        ...countdownSettings,
        label: label || DEFAULT_COUNTDOWN_SETTINGS.label,
        countdownStartTimestamp:
          countdownStartTimestamp || DEFAULT_COUNTDOWN_SETTINGS.countdownStartTimestamp,
        countdownDeadlineTimestamp:
          countdownDeadlineTimestamp || DEFAULT_COUNTDOWN_SETTINGS.countdownDeadlineTimestamp,
        theme: {
          backgroundColor: backgroundColor || DEFAULT_COUNTDOWN_SETTINGS.theme.backgroundColor,
          foregroundColor: foregroundColor || DEFAULT_COUNTDOWN_SETTINGS.theme.foregroundColor,
        },
      });
  };
  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!countdownSettings}
            onChange={onCheckboxChanged}
            color="primary"
            disabled={isDisabled}
          />
        }
        label="Countdown"
      />

      {!!countdownSettings && (
        <div className={classes.fieldsContainer}>
          <TextField
            inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
            error={!!errors.label}
            helperText={errors?.label?.message}
            onBlur={handleSubmit(onSubmit)}
            name="label"
            label="Label"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          <TextField
            inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
            error={!!errors.countdownStartTimestamp}
            helperText={errors?.countdownStartTimestamp?.message}
            onBlur={handleSubmit(onSubmit)}
            name="countdownStartTimestamp"
            label="Start Date"
            type={'datetime-local'}
            defaultValue={new Date().toISOString().slice(0, 19)}
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          <TextField
            inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
            error={!!errors.countdownDeadlineTimestamp}
            helperText={errors?.countdownDeadlineTimestamp?.message}
            onBlur={handleSubmit(onSubmit)}
            name="countdownDeadlineTimestamp"
            label="End Date"
            type={'datetime-local'}
            defaultValue={new Date().toISOString().slice(0, 19)}
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          <TextField
            inputRef={register({ required: true })}
            error={!!errors.backgroundColor}
            helperText={errors?.backgroundColor?.message}
            onBlur={handleSubmit(onSubmit)}
            name="backgroundColor"
            label="Background Color"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          <TextField
            inputRef={register({ required: true })}
            error={!!errors.foregroundColor}
            helperText={errors?.foregroundColor?.message}
            onBlur={handleSubmit(onSubmit)}
            name="foregroundColor"
            label="Foreground Color"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
        </div>
      )}
    </div>
  );
};

export default CountdownEditor;

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CountDownSettings } from './helpers/shared';
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
  countdownStartInMillis: string;
  countdownDeadlineInMillis: string;
  backgroundColor: string;
  foregroundColor: string;
}

const DEFAULT_COUNTDOWN_SETTINGS: CountDownSettings = {
  label: 'Last chance to claim your 30% discount offer',
  countdownStartInMillis: '',
  countdownDeadlineInMillis: '',
  theme: {
    backgroundColor: '#1e3e72',
    foregroundColor: '#ffffff',
  },
};

interface CountDownEditorProps {
  isDisabled: boolean;
  countDownSettings?: CountDownSettings;
  updateCountDownSettings: (updatedCountDownSettings?: CountDownSettings) => void;
  onValidationChange: (isValid: boolean) => void;
}

const CountDownEditor: React.FC<CountDownEditorProps> = ({
  isDisabled,
  countDownSettings,
  updateCountDownSettings,
  onValidationChange,
}: CountDownEditorProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    label: countDownSettings?.label || 'Last chance to claim your 30% discount offer',
    countdownStartInMillis:
      countDownSettings?.countdownStartInMillis || new Date().toISOString().slice(0, 16),
    countdownDeadlineInMillis:
      countDownSettings?.countdownDeadlineInMillis || new Date().toISOString().slice(0, 16),
    backgroundColor: countDownSettings?.theme.backgroundColor || '#1e3e72',
    foregroundColor: countDownSettings?.theme.foregroundColor || '#ffffff',
  };

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [
    defaultValues.label,
    defaultValues.countdownStartInMillis,
    defaultValues.countdownStartInMillis,
    defaultValues.backgroundColor,
    defaultValues.foregroundColor,
  ]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [
    errors.label,
    errors.countdownStartInMillis,
    errors.countdownDeadlineInMillis,
    errors.backgroundColor,
    errors.foregroundColor,
  ]);

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    updateCountDownSettings(isChecked ? DEFAULT_COUNTDOWN_SETTINGS : undefined);
  };
  const onSubmit = ({
    label,
    countdownStartInMillis,
    countdownDeadlineInMillis,
    backgroundColor,
    foregroundColor,
  }: FormData): void => {
    countDownSettings &&
      updateCountDownSettings({
        ...countDownSettings,
        label: label || DEFAULT_COUNTDOWN_SETTINGS.label,
        countdownStartInMillis:
          countdownStartInMillis || DEFAULT_COUNTDOWN_SETTINGS.countdownStartInMillis,
        countdownDeadlineInMillis:
          countdownDeadlineInMillis || DEFAULT_COUNTDOWN_SETTINGS.countdownDeadlineInMillis,
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
            checked={!!countDownSettings}
            onChange={onCheckboxChanged}
            color="primary"
            disabled={isDisabled}
          />
        }
        label="Countdown"
      />

      {!!countDownSettings && (
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
            error={!!errors.countdownStartInMillis}
            helperText={errors?.countdownStartInMillis?.message}
            onBlur={handleSubmit(onSubmit)}
            name="countdownStartInMillis"
            label="Start Date"
            type={'datetime-local'}
            defaultValue={new Date().toISOString().slice(0, 16)}
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          <TextField
            inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
            error={!!errors.countdownDeadlineInMillis}
            helperText={errors?.countdownDeadlineInMillis?.message}
            onBlur={handleSubmit(onSubmit)}
            name="countdownDeadlineInMillis"
            label="End Date"
            type={'datetime-local'}
            defaultValue={new Date().toISOString().slice(0, 16)}
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

export default CountDownEditor;

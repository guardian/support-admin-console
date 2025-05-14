import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox, TextField, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CountdownSettings } from './helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';
import Switch from '@mui/material/Switch';

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
  useLocalTime: boolean;
  backgroundColor: string;
  foregroundColor: string;
}

const DEFAULT_COUNTDOWN_SETTINGS: CountdownSettings = {
  label: 'Last chance to claim your 30% discount offer',
  countdownStartTimestamp: '',
  countdownDeadlineTimestamp: '',
  useLocalTime: false,
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
    useLocalTime: countdownSettings?.useLocalTime || false,
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
    defaultValues.countdownDeadlineTimestamp,
    defaultValues.useLocalTime,
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
    errors.useLocalTime,
    errors.backgroundColor,
    errors.foregroundColor,
  ]);

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    updateCountdownSettings(isChecked ? DEFAULT_COUNTDOWN_SETTINGS : undefined);
  };

  const onUseLocalTimeChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isUseLocalTimeEnabled = event.target.checked;
    updateCountdownSettings({
      ...countdownSettings,
      useLocalTime: isUseLocalTimeEnabled,
    } as CountdownSettings);
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

          <FormControlLabel
            control={
              <Switch
                checked={!!countdownSettings.useLocalTime}
                onChange={onUseLocalTimeChanged}
                onBlur={handleSubmit(onSubmit)}
                name="useLocalTime"
                disabled={isDisabled}
              />
            }
            label="Use Local Time"
          />
          <Typography variant="subtitle1" gutterBottom>
            Local time: E.g. in a US campaign, end at midnight local time. This means users on the
            east coast stop seeing the countdown before users on the west coast. And if a user on
            the west coast and a user on the east coast view the page at the same moment, they will
            each see a different number of hours remaining on the countdown.
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            UTC: E.g. for a promo code with a midnight expiry, which is always in UTC. This means
            all users will stop seeing the countdown at the same time, and it will show the same
            hours/minutes remaining. It also means e.g. if a user on the US east coast views the
            page at 19:00 local time, then the countdown says 1 hour remaining.
          </Typography>

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

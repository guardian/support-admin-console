import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Theme,
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TickerCountType, TickerEndType, TickerName, TickerSettings } from './helpers/shared';
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
  countLabel: string;
  goalReachedPrimary: string;
  goalReachedSecondary: string;
  currencySymbol: string;
}

const DEFAULT_TICKER_SETTINGS: TickerSettings = {
  endType: TickerEndType.unlimited,
  countType: TickerCountType.money,
  copy: {
    countLabel: 'contributions',
    goalReachedPrimary: "We've hit our goal!",
    goalReachedSecondary: 'but you can still support us',
  },
  currencySymbol: '$',
  name: TickerName.US,
};

interface TickerEditorProps {
  isDisabled: boolean;
  tickerSettings?: TickerSettings;
  updateTickerSettings: (updatedTickerSettings?: TickerSettings) => void;
  onValidationChange: (isValid: boolean) => void;
}

const TickerEditor: React.FC<TickerEditorProps> = ({
  isDisabled,
  tickerSettings,
  updateTickerSettings,
  onValidationChange,
}: TickerEditorProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    countLabel: tickerSettings?.copy.countLabel || '',
    goalReachedPrimary: tickerSettings?.copy.goalReachedPrimary || '',
    goalReachedSecondary: tickerSettings?.copy.goalReachedSecondary || '',
    currencySymbol: tickerSettings?.currencySymbol || '',
  };

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [
    defaultValues.countLabel,
    defaultValues.goalReachedPrimary,
    defaultValues.goalReachedSecondary,
    defaultValues.currencySymbol,
  ]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [
    errors.countLabel,
    errors.goalReachedPrimary,
    errors.goalReachedSecondary,
    errors.currencySymbol,
  ]);

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    updateTickerSettings(isChecked ? DEFAULT_TICKER_SETTINGS : undefined);
  };

  const onEndTypeChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedType = event.target.value as TickerEndType;
    tickerSettings && updateTickerSettings({ ...tickerSettings, endType: selectedType });
  };

  const onNameChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedName = event.target.value as TickerName;
    tickerSettings && updateTickerSettings({ ...tickerSettings, name: selectedName });
  };

  const onSubmit = ({
    countLabel,
    goalReachedPrimary,
    goalReachedSecondary,
    currencySymbol,
  }: FormData): void => {
    tickerSettings &&
      updateTickerSettings({
        ...tickerSettings,
        copy: { countLabel, goalReachedPrimary, goalReachedSecondary },
        currencySymbol: currencySymbol || '$',
      });
  };

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!tickerSettings}
            onChange={onCheckboxChanged}
            color="primary"
            disabled={isDisabled}
          />
        }
        label="Ticker"
      />

      {!!tickerSettings && (
        <div className={classes.fieldsContainer}>
          <div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Ticker campaign name</FormLabel>
              <RadioGroup
                value={tickerSettings.name}
                onChange={onNameChanged}
                aria-label="ticker-name"
                name="ticker-name"
              >
                <FormControlLabel
                  value={TickerName.US}
                  control={<Radio />}
                  label="US"
                  disabled={isDisabled}
                />
                <FormControlLabel
                  value={TickerName.AU}
                  control={<Radio />}
                  label="AU"
                  disabled={isDisabled}
                />
              </RadioGroup>
            </FormControl>
          </div>

          <TextField
            inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
            error={!!errors.countLabel}
            helperText={errors?.countLabel?.message}
            onBlur={handleSubmit(onSubmit)}
            name="countLabel"
            label="Count Label"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          <TextField
            inputRef={register({ required: true })}
            error={!!errors.goalReachedPrimary}
            helperText={errors?.goalReachedPrimary?.message}
            onBlur={handleSubmit(onSubmit)}
            name="goalReachedPrimary"
            label="Goal reached primary text"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          <TextField
            inputRef={register({ required: true })}
            error={!!errors.goalReachedSecondary}
            helperText={errors?.goalReachedSecondary?.message}
            onBlur={handleSubmit(onSubmit)}
            name="goalReachedSecondary"
            label="Goal reached secondary text"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          {tickerSettings.countType === 'money' && (
            <TextField
              inputRef={register({ required: true })}
              error={!!errors.currencySymbol}
              helperText={errors?.currencySymbol?.message}
              onBlur={handleSubmit(onSubmit)}
              name="currencySymbol"
              label="Currency"
              margin="normal"
              variant="outlined"
              disabled={isDisabled}
              fullWidth
            />
          )}

          <div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Ticker end type</FormLabel>
              <RadioGroup
                value={tickerSettings.endType}
                onChange={onEndTypeChanged}
                aria-label="ticker-end-type"
                name="ticker-end-type"
              >
                <FormControlLabel
                  value={TickerEndType.hardstop}
                  control={<Radio />}
                  label="Hard stop"
                  disabled={isDisabled}
                />
                <FormControlLabel
                  value={TickerEndType.unlimited}
                  control={<Radio />}
                  label="Unlimited"
                  disabled={isDisabled}
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      )}
    </div>
  );
};

export default TickerEditor;

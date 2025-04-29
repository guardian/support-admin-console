import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Theme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TickerName, TickerSettings } from './helpers/shared';
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
  goalCopy: string;
  currencySymbol: string;
}

const DEFAULT_TICKER_SETTINGS: TickerSettings = {
  copy: {
    countLabel: 'Contributions',
    goalCopy: 'goal',
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
    goalCopy: tickerSettings?.copy.goalCopy || '',
    currencySymbol: tickerSettings?.currencySymbol || '',
  };

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues.countLabel, defaultValues.goalCopy, defaultValues.currencySymbol]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.countLabel, errors.goalCopy, errors.currencySymbol]);

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    updateTickerSettings(isChecked ? DEFAULT_TICKER_SETTINGS : undefined);
  };

  const onNameChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedName = event.target.value as TickerName;
    tickerSettings &&
      updateTickerSettings({
        ...tickerSettings,
        name: selectedName,
        currencySymbol: selectedName === TickerName.GLOBAL ? '' : '$',
      });
  };

  const onSubmit = ({ countLabel, goalCopy, currencySymbol }: FormData): void => {
    tickerSettings &&
      updateTickerSettings({
        ...tickerSettings,
        copy: { countLabel, goalCopy: goalCopy ?? 'goal' },
        currencySymbol: currencySymbol ?? '',
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
                <FormControlLabel
                  value={TickerName.GLOBAL}
                  control={<Radio />}
                  label="GLOBAL"
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
            label="Heading"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          <TextField
            inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
            error={!!errors.goalCopy}
            helperText={errors?.goalCopy?.message}
            onBlur={handleSubmit(onSubmit)}
            name="goalCopy"
            label="Goal Copy"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          {(tickerSettings.name === 'US' || tickerSettings.name === 'AU') && (
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
        </div>
      )}
    </div>
  );
};

export default TickerEditor;

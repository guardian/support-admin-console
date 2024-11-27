import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TickerSettings } from './helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';
import { SupportLandingPageVariant } from '../../models/supportLandingPage';

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
  campaignName: string;
  enableSingleContributions: boolean;
  campaignCopy: string;
}

// const DEFAULT_CAMPAIGN_SETTINGS: TickerSettings = {
//   endType: TickerEndType.unlimited,
//   countType: TickerCountType.money,
//   copy: {
//     countLabel: 'Contributions',
//     goalReachedPrimary: '', //deprecated for now
//     goalReachedSecondary: '', //deprecated for now
//   },
//   currencySymbol: '$',
//   name: TickerName.US,
// };
//
export interface CountdownSetting {
  label: string;
  countdownStartInMillis: number;
  countdownDeadlineInMillis: number;
  theme: {
    backgroundColor: string;
    foregroundColor: string;
  };
}

interface CampaignCopy {
  headingFragment?: JSX.Element;
  subheading?: JSX.Element;
  oneTimeHeading?: JSX.Element;
  punctuation?: JSX.Element;
}

export type CampaignTickerSettings = Omit<TickerSettings, 'tickerData'> & {
  id: string;
};

export interface CampaignSettings {
  campaignName: string;
  enableSingleContributions: boolean;
  countdownSettings?: CountdownSetting[];
  copy: CampaignCopy;
  tickerSettings?: CampaignTickerSettings;
}

interface CampaignEditorProps {
  variant: SupportLandingPageVariant;
  isDisabled: boolean;
  tickerSettings?: CampaignTickerSettings;
  updateTickerSettings: (updatedTickerSettings?: CampaignTickerSettings) => void;
  onValidationChange: (isValid: boolean) => void;
}

const CampaignEditor: React.FC<CampaignEditorProps> = ({
  variant,
  isDisabled,
  tickerSettings,
  updateTickerSettings,
  onValidationChange,
}: CampaignEditorProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    campaignName: '',
    enableSingleContributions: false,
    campaignCopy: '',
  };

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [
    defaultValues.campaignName,
    defaultValues.enableSingleContributions,
    defaultValues.campaignCopy,
  ]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.campaignName, errors.enableSingleContributions, errors.campaignCopy]);

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    console.log('isChecked', isChecked);
    updateTickerSettings(undefined);
  };

  const onSubmit = ({}: FormData): void => {
    tickerSettings &&
      updateTickerSettings({
        ...tickerSettings,
      });
  };

  console.log('Unused', variant);

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
        label="Campaign"
      />

      {!!tickerSettings && (
        <div className={classes.fieldsContainer}>
          <TextField
            inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
            error={!!errors.campaignName}
            helperText={errors?.campaignName?.message}
            onBlur={handleSubmit(onSubmit)}
            name="countLabel"
            label="Campaign name"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!tickerSettings}
                onChange={onCheckboxChanged}
                color="primary"
                disabled={isDisabled}
              />
            }
            label="Enable Single Contributions"
          />
        </div>
      )}
    </div>
  );
};

export default CampaignEditor;

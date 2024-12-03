import React, { ReactElement, useEffect } from 'react';
import { FormControl, Radio, RadioGroup, FormControlLabel, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Variant } from '../../channelManagement/helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from '../../channelManagement/helpers/validation';
import { useForm } from 'react-hook-form';
import {
  ControlProportionSettings,
  hasControl,
} from '../../channelManagement/helpers/controlProportionSettings';

const MAX_MVT = 1_000_000;

const randomMvt = (): number => Math.round(Math.random() * MAX_MVT);

// adapted from https://stackoverflow.com/a/11832950
const round = (n: number): number => Math.round((n + Number.EPSILON) * MAX_MVT) / MAX_MVT;

const useStyles = makeStyles(({ spacing }: Theme) => ({
  variantsContainer: {
    display: 'flex',
    margin: '15px 30px 0 30px',
    '& > * + *': {
      marginLeft: spacing(3),
    },
  },
  variantField: {
    backgroundColor: '#EEEEEE',
  },
}));

interface FormState {
  percentage?: number;
}

interface TestVariantsSplitEditorProps {
  variants: Variant[];
  controlProportionSettings?: ControlProportionSettings;
  onControlProportionSettingsChange: (
    controlProportionSettings?: ControlProportionSettings,
  ) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const TestVariantsSplitEditor: React.FC<TestVariantsSplitEditorProps> = ({
  variants,
  controlProportionSettings,
  onControlProportionSettingsChange,
  onValidationChange,
  isDisabled,
}: TestVariantsSplitEditorProps) => {
  const classes = useStyles();

  const defaultValues = {
    percentage: controlProportionSettings ? controlProportionSettings.proportion * 100 : undefined,
  };

  const { register, formState: {errors}, handleSubmit, trigger, reset } = useForm<FormState>({
    mode: 'onChange',
    defaultValues,
  });

  // clears error if necessary
  useEffect(() => {
    trigger();
  }, []);

  // display initial value when switching to manual
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues.percentage]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0 || !controlProportionSettings;
    onValidationChange(isValid);
  }, [errors.percentage]);

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'manual') {
      onControlProportionSettingsChange({
        proportion: round(1 / variants.length),
        offset: randomMvt(),
      });
    } else {
      onControlProportionSettingsChange(undefined);
    }
  };

  const onSubmit = (controlProportionSettings: ControlProportionSettings) => ({
    percentage,
  }: FormState): void => {
    if (percentage) {
      onControlProportionSettingsChange({
        proportion: round(percentage / 100),
        offset: controlProportionSettings.offset,
      });
    }
  };

  const validate = (text: number | undefined): string | boolean => {
    const percentage = Number(text);
    if (!Number.isNaN(percentage)) {
      const controlExists = hasControl(variants);
      if (controlExists) {
        const max = 100 / variants.length;
        if (percentage <= max) {
          return true;
        } else {
          return `Control cannot be greater than ${+max.toFixed(2)}`;
        }
      } else {
        return 'No control variant exists';
      }
    } else {
      return 'Must be a number';
    }
  };

  const renderVariants = (controlProportion: number): ReactElement[] => {
    const percentage = ((1 - controlProportion) / (variants.length - 1)) * 100;
    return variants
      .filter(v => v.name.toLowerCase() !== 'control')
      .map(variant => (
        <div key={`${variant.name}_proportion`}>
          <TextField
            value={+percentage.toFixed(2)}
            label={variant.name}
            helperText="This value cannot be edited"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
            disabled={true}
            InputProps={{
              className: classes.variantField,
            }}
          />
        </div>
      ));
  };

  return (
    <div>
      <FormControl>
        <RadioGroup
          value={controlProportionSettings ? 'manual' : 'auto'}
          onChange={onRadioGroupChange}
        >
          <FormControlLabel
            value="auto"
            key="auto"
            control={<Radio />}
            label="Auto split"
            disabled={isDisabled}
          />
          <FormControlLabel
            value="manual"
            key="manual"
            control={<Radio />}
            label="Manual split"
            disabled={isDisabled}
          />
        </RadioGroup>

        {controlProportionSettings && (
          <div className={classes.variantsContainer}>
            <div>
              <TextField
                {...register('percentage',{
                  required: EMPTY_ERROR_HELPER_TEXT,
                  validate: validate,
                })}
                error={errors.percentage !== undefined}
                helperText={errors.percentage?.message || 'Must be a number'}
                onBlur={handleSubmit(onSubmit(controlProportionSettings))}
                name="percentage"
                label="CONTROL"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                disabled={isDisabled}
              />
            </div>

            {renderVariants(controlProportionSettings.proportion)}
          </div>
        )}
      </FormControl>
    </div>
  );
};

export default TestVariantsSplitEditor;

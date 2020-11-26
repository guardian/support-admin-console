import React, { ReactElement, useEffect } from 'react';
import {
  FormControl,
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Theme,
} from '@material-ui/core';
import { ControlProportionSettings, EpicVariant } from './epicTestsForm';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { useForm } from 'react-hook-form';

const hasControl = (variants: EpicVariant[]): boolean =>
  !!variants.find(v => v.name.toLowerCase() === 'control');

const randomMvt = (): number => Math.round(Math.random() * 1000000);

const useStyles = makeStyles(({ spacing }: Theme) => ({
  variantsContainer: {
    display: 'flex',
    margin: '15px 30px 0 30px',
    '& > * + *': {
      marginLeft: spacing(3),
    },
  },
  variant: {},
}));

interface FormState {
  proportion?: number;
}

interface EpicTestVariantsSplitEditorProps {
  variants: EpicVariant[];
  controlProportionSettings?: ControlProportionSettings;
  onControlProportionSettingsChange: (
    controlProportionSettings?: ControlProportionSettings,
  ) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const EpicTestVariantsSplitEditor: React.FC<EpicTestVariantsSplitEditorProps> = ({
  variants,
  controlProportionSettings,
  onControlProportionSettingsChange,
  onValidationChange,
  isDisabled,
}: EpicTestVariantsSplitEditorProps) => {
  const classes = useStyles();

  const defaultValues = { proportion: controlProportionSettings?.proportion };

  const { register, errors, handleSubmit, trigger, getValues, reset } = useForm<FormState>({
    mode: 'onChange',
    defaultValues,
  });

  // clears error if necessary
  useEffect(() => {
    trigger();
  }, [variants]);

  // display initial value when switching to manual
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues.proportion]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0 || !getValues().proportion;
    onValidationChange(isValid);
  }, [errors.proportion]);

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'manual') {
      onControlProportionSettingsChange({
        proportion: 1 / variants.length,
        offset: randomMvt(),
      });
    } else {
      onControlProportionSettingsChange(undefined);
    }
  };

  const onSubmit = (controlProportionSettings: ControlProportionSettings) => ({
    proportion,
  }: FormState): void => {
    if (proportion) {
      onControlProportionSettingsChange({
        proportion,
        offset: controlProportionSettings.offset,
      });
    }
  };

  const validate = (text: string): string | boolean => {
    const value = Number(text);
    if (!Number.isNaN(value)) {
      const controlExists = hasControl(variants);
      if (controlExists) {
        const max = 1 / variants.length;
        if (value <= max) {
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
    const proportion = (1 - controlProportion) / (variants.length - 1);
    return variants
      .filter(v => v.name.toLowerCase() !== 'control')
      .map(variant => (
        <div className={classes.variant} key={`${variant.name}_proportion`}>
          <TextField
            value={+proportion.toFixed(2)}
            label={variant.name}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            fullWidth
            disabled={true}
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

        {controlProportionSettings && hasControl(variants) && (
          <div className={classes.variantsContainer}>
            <div className={classes.variant}>
              <TextField
                inputRef={register({
                  required: EMPTY_ERROR_HELPER_TEXT,
                  validate: validate,
                })}
                error={errors.proportion !== undefined}
                helperText={errors.proportion?.message}
                onBlur={handleSubmit(onSubmit(controlProportionSettings))}
                name="proportion"
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

export default EpicTestVariantsSplitEditor;

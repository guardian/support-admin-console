import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Checkbox,
  createStyles,
  FormControlLabel,
  TextField,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { Cta } from './helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
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
  });

interface FormData {
  text: string;
  baseUrl: string;
}

interface VariantEditorButtonEditorProps extends WithStyles<typeof styles> {
  label: string;
  cta?: Cta;
  updateCta: (updatedCta?: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  defaultCta: Cta;
  isDisabled: boolean;
}

const VariantEditorButtonEditor: React.FC<VariantEditorButtonEditorProps> = ({
  classes,
  label,
  cta,
  updateCta,
  onValidationChange,
  defaultCta,
  isDisabled,
}: VariantEditorButtonEditorProps) => {
  const isChecked = cta !== undefined;

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    updateCta(isChecked ? defaultCta : undefined);
  };

  const defaultValues: FormData = {
    text: cta?.text || '',
    baseUrl: cta?.baseUrl || '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onChange', defaultValues });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.text, errors.baseUrl]);

  const onSubmit = ({ text, baseUrl }: FormData): void => {
    updateCta({ text, baseUrl });
  };

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={onCheckboxChanged}
            color="primary"
            disabled={isDisabled}
          />
        }
        label={label}
      />

      {isChecked && (
        <div className={classes.fieldsContainer}>
          <TextField
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
            })}
            error={errors.text !== undefined}
            helperText={errors.text?.message}
            onBlur={handleSubmit(onSubmit)}
            name="text"
            label="Button copy"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
            })}
            error={errors.baseUrl !== undefined}
            helperText={errors.baseUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="baseUrl"
            label="Button destination"
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

export default withStyles(styles)(VariantEditorButtonEditor);

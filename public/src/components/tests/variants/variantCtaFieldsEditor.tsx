import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { Cta } from '../../channelManagement/helpers/shared';
import {
  copyLengthValidator,
  EMPTY_ERROR_HELPER_TEXT,
} from '../../channelManagement/helpers/validation';

interface FormData {
  text: string;
  baseUrl: string;
}

interface VariantCtaFieldsEditorProps {
  cta: Cta;
  updateCta: (updatedCta: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  copyLength?: number;
  isPrimaryCtaUrlDisabled?: boolean;
}

const VariantCtaFieldsEditor: React.FC<VariantCtaFieldsEditorProps> = ({
  cta,
  updateCta,
  onValidationChange,
  isDisabled,
  copyLength = 100,
  isPrimaryCtaUrlDisabled = false,
}: VariantCtaFieldsEditorProps) => {
  const defaultValues: FormData = {
    text: cta.text,
    baseUrl: cta.baseUrl,
  };

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange', defaultValues });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.text, errors.baseUrl]);

  const onSubmit = ({ text, baseUrl }: FormData): void => {
    updateCta({ text, baseUrl });
  };

  return (
    <div>
      <TextField
        error={errors.text !== undefined}
        helperText={errors.text?.message}
        {...register('text', {
          required: EMPTY_ERROR_HELPER_TEXT,
          validate: copyLengthValidator(copyLength),
        })}
        onBlur={handleSubmit(onSubmit)}
        label="Button copy"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />

      <TextField
        error={errors.baseUrl !== undefined}
        helperText={
          errors.baseUrl?.message ||
          (isPrimaryCtaUrlDisabled ? 'URL is not applied for enabled choice cards.' : undefined)
        }
        {...register('baseUrl', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        onBlur={handleSubmit(onSubmit)}
        label="Button destination"
        margin="normal"
        variant="outlined"
        disabled={isDisabled || isPrimaryCtaUrlDisabled}
        fullWidth
      />
    </div>
  );
};

export default VariantCtaFieldsEditor;

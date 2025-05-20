import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { Cta } from '../../channelManagement/helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from '../../channelManagement/helpers/validation';

interface FormData {
  text: string;
  baseUrl: string;
}

interface VariantCtaFieldsEditorProps {
  cta: Cta;
  updateCta: (updatedCta: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const VariantCtaFieldsEditor: React.FC<VariantCtaFieldsEditorProps> = ({
  cta,
  updateCta,
  onValidationChange,
  isDisabled,
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
        helperText={errors.baseUrl?.message}
        {...register('baseUrl', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        onBlur={handleSubmit(onSubmit)}
        label="Button destination"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
    </div>
  );
};

export default VariantCtaFieldsEditor;

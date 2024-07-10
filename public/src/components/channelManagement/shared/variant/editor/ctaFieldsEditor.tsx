import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { Cta } from '../../../helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from '../../../helpers/validation';

interface FormData {
  text: string;
  baseUrl: string;
}

interface VariantEditorCtaFieldsEditorProps {
  cta: Cta;
  updateCta: (updatedCta: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const CtaFieldsEditor: React.FC<VariantEditorCtaFieldsEditorProps> = ({
  cta,
  updateCta,
  onValidationChange,
  isDisabled,
}: VariantEditorCtaFieldsEditorProps) => {
  const defaultValues: FormData = {
    text: cta.text,
    baseUrl: cta.baseUrl,
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
    <div>
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
  );
};

export default CtaFieldsEditor;

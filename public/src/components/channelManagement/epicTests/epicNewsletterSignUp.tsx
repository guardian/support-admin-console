import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import { NewsletterSignup } from '../helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { useForm } from 'react-hook-form';

interface FormData {
  url: string;
}

interface EpicTestNewsletterProps {
  newsletterSignup: NewsletterSignup;
  updateNewsletterSignup: (updateNewsletterSignup?: NewsletterSignup) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const EpicTestNewsletter: React.FC<EpicTestNewsletterProps> = ({
  newsletterSignup,
  updateNewsletterSignup,
  onValidationChange,
  isDisabled,
}: EpicTestNewsletterProps) => {
  const defaultValues: FormData = {
    url: newsletterSignup.url,
  };
  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onChange', defaultValues });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.url]);

  const onSubmit = ({ url }: FormData): void => {
    updateNewsletterSignup({ url });
  };

  return (
    <div>
      <TextField
        inputRef={register({
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        error={errors.url !== undefined}
        helperText={errors.url?.message}
        onBlur={handleSubmit(onSubmit)}
        name="url"
        label="Newsletter URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
    </div>
  );
};

export default EpicTestNewsletter;

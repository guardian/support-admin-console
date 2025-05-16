import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import { NewsletterSignup } from '../helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { useForm } from 'react-hook-form';

interface FormData {
  newsletterId: string;
  successDescription: string;
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
    newsletterId: newsletterSignup.newsletterId,
    successDescription: newsletterSignup.successDescription,
  };
  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onChange', defaultValues });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.newsletterId, errors.successDescription]);

  const onSubmit = ({ newsletterId, successDescription }: FormData): void => {
    updateNewsletterSignup({ newsletterId, successDescription });
  };

  return <>
    <div>
      <TextField
        error={errors.newsletterId !== undefined}
        helperText={errors.newsletterId?.message}
        onBlur={handleSubmit(onSubmit)}
        {...register('newsletterId', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        label="Newsletter Id"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth />
    </div>
    <div>
      <TextField
        error={errors.successDescription !== undefined}
        helperText={errors.successDescription?.message}
        onBlur={handleSubmit(onSubmit)}
        {...register('successDescription', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        label="Sign up success message"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth />
    </div>
  </>;
};

export default EpicTestNewsletter;

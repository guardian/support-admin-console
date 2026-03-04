import React, { useEffect } from 'react';
import { ResponsiveImage } from '../../models/shared';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { StudentLandingPageVariant } from '../../models/studentLandingPage';

export interface ImageGuidance {
  mobileUrlGuidance: string;
  tabletUrlGuidance: string;
  desktopUrlGuidance: string;
}
interface ResponsiveImageEditorProps {
  variant: StudentLandingPageVariant;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
  onChange: (image: ResponsiveImage) => void;
  imageGuidance?: ImageGuidance;
}

export const ResponsiveImageEditor: React.FC<ResponsiveImageEditorProps> = ({
  variant,
  isDisabled,
  onValidationChange,
  onChange,
  imageGuidance,
}: ResponsiveImageEditorProps) => {
  const EMPTY_ERROR_HELPER_TEXT = 'Please add a URL for an image in these dimensions';

  const defaultValues: ResponsiveImage = {
    ...variant.image,
  };

  const {
    register,
    handleSubmit,
    trigger,
    reset,

    formState: { errors },
  } = useForm<ResponsiveImage>({
    mode: 'onChange',
    defaultValues,
    shouldFocusError:false,
  });

  useEffect(() => {
    trigger();
  },[])

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.desktopUrl, errors.tabletUrl, errors.mobileUrl, errors.altText]);

  useEffect(() => {
    reset(variant.image);
  }, [variant.image, reset]);

  return (
    <div>
      <TextField
        {...register('mobileUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.mobileUrlGuidance}`,
        })}
        error={errors?.mobileUrl !== undefined}
        helperText={errors?.mobileUrl?.message ?? imageGuidance?.mobileUrlGuidance}
        onBlur={handleSubmit(onChange)}
        label="Mobile Image URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        {...register('tabletUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.tabletUrlGuidance}`,
        })}
        error={errors?.tabletUrl !== undefined}
        helperText={errors?.tabletUrl?.message ?? imageGuidance?.tabletUrlGuidance}
        onBlur={handleSubmit(onChange)}
        label="Tablet Image URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        {...register('desktopUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.desktopUrlGuidance}`,
        })}
        error={errors?.desktopUrl !== undefined}
        helperText={errors?.desktopUrl?.message ?? imageGuidance?.desktopUrlGuidance}
        onBlur={handleSubmit(onChange)}
        label="Desktop URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        {...register('altText', {
          required: 'Please add some descriptive text for the image',
        })}
        error={errors?.altText !== undefined}
        helperText={errors?.altText?.message ?? 'A descriptive message for the user'}
        onBlur={handleSubmit(onChange)}
        label="Image Description (alt text)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
    </div>
  );
};

import React, { useEffect } from 'react';
import { ResponsiveImage } from '../../models/shared';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

export interface ImageGuidance {
  mobileUrl: string;
  tabletUrl: string;
  desktopUrl: string;
}
interface ResponsiveImageEditorProps {
  image: ResponsiveImage;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
  onChange: (image: ResponsiveImage) => void;
  imageGuidance?: ImageGuidance;
}

export const ResponsiveImageEditor: React.FC<ResponsiveImageEditorProps> = ({
  image,
  isDisabled,
  onValidationChange,
  onChange,
  imageGuidance,
}: ResponsiveImageEditorProps) => {

  const EMPTY_ERROR_HELPER_TEXT = 'Please add a URL for an image in these dimensions';

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<ResponsiveImage>({
    mode: 'onChange',
    defaultValues: image,
  });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.desktopUrl, errors.tabletUrl, errors.mobileUrl, errors.altText]);

  useEffect(() => {
    // necessary to reset fields if user discards changes
    reset(image);
  }, [image]);

  return (
    <div>
      <TextField
        error={errors?.mobileUrl !== undefined}
        helperText={errors?.mobileUrl?.message ?? imageGuidance?.mobileUrl}
        {...register('mobileUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.mobileUrl}`,
        })}
        onBlur={handleSubmit(onChange)}
        label="Mobile Image URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        error={errors?.tabletUrl !== undefined}
        helperText={errors?.tabletUrl?.message ?? imageGuidance?.tabletUrl}
        {...register('tabletUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.tabletUrl}`,
        })}
        onBlur={handleSubmit(onChange)}
        label="Tablet Image URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        error={errors?.desktopUrl !== undefined}
        helperText={errors?.desktopUrl?.message ?? imageGuidance?.desktopUrl}
        {...register('desktopUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.desktopUrl}`,
        })}
        onBlur={handleSubmit(onChange)}
        label="Desktop URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        error={errors?.altText !== undefined}
        helperText={errors?.altText?.message ?? 'A descriptive message for the user'}
        {...register('altText', {
          required: 'Please add some descriptive text for the image',
        })}
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

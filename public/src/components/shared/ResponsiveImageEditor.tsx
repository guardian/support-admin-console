import { TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ResponsiveImage } from '../../models/shared';

export interface ImageGuidance {
  mobileUrlGuidance: string;
  tabletUrlGuidance: string;
  desktopUrlGuidance: string;
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
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<ResponsiveImage>({
    mode: 'onChange',
    defaultValues: image,
    shouldFocusError: false,
  });

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  useEffect(() => {
    reset(image);
    void trigger();
  }, [image, reset, trigger]);

  return (
    <div>
      <TextField
        {...register('mobileUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.mobileUrlGuidance}`,
          validate: (value) => value.trim().length > 0 || EMPTY_ERROR_HELPER_TEXT,
        })}
        error={errors.mobileUrl !== undefined}
        helperText={errors.mobileUrl?.message ?? imageGuidance?.mobileUrlGuidance}
        onBlur={() => void handleSubmit(onChange)()}
        label="Mobile Image URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        {...register('tabletUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.tabletUrlGuidance}`,
          validate: (value) => value.trim().length > 0 || EMPTY_ERROR_HELPER_TEXT,
        })}
        error={errors.tabletUrl !== undefined}
        helperText={errors.tabletUrl?.message ?? imageGuidance?.tabletUrlGuidance}
        onBlur={() => void handleSubmit(onChange)()}
        label="Tablet Image URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        {...register('desktopUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.desktopUrlGuidance}`,
          validate: (value) => value.trim().length > 0 || EMPTY_ERROR_HELPER_TEXT,
        })}
        error={errors.desktopUrl !== undefined}
        helperText={errors.desktopUrl?.message ?? imageGuidance?.desktopUrlGuidance}
        onBlur={() => void handleSubmit(onChange)()}
        label="Desktop URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        {...register('altText', {
          required: 'Please add some descriptive text for the image',
          validate: (value) =>
            value.trim().length > 0 || 'Please add some descriptive text for the image',
        })}
        error={errors.altText !== undefined}
        helperText={errors.altText?.message ?? 'A descriptive message for the user'}
        onBlur={() => void handleSubmit(onChange)()}
        label="Image Description (alt text)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
    </div>
  );
};

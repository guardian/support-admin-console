import { TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Inline1Variant } from '../../models/inline1';
import { ResponsiveImage } from '../../models/shared';
import { StudentLandingPageVariant } from '../../models/studentLandingPage';

export interface ImageGuidance {
  mobileUrlGuidance: string;
  tabletUrlGuidance: string;
  desktopUrlGuidance: string;
}

const EMPTY_IMAGE: ResponsiveImage = {
  mobileUrl: '',
  tabletUrl: '',
  desktopUrl: '',
  altText: '',
};

// Extracts the ResponsiveImage from either a StudentLandingPageVariant (which always has an
// image) or an Inline1Variant (which only has an optional image on its support message).
const getVariantImage = (
  variant: StudentLandingPageVariant | Inline1Variant,
): ResponsiveImage | undefined =>
  'message' in variant
    ? variant.message.type === 'Inline1SupportMessage'
      ? variant.message.image
      : undefined
    : variant.image;

interface ResponsiveImageEditorProps {
  variant: StudentLandingPageVariant | Inline1Variant;
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

  const image = getVariantImage(variant) ?? EMPTY_IMAGE;

  const defaultValues: ResponsiveImage = {
    ...image,
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
    shouldFocusError: false,
  });

  useEffect(() => {
    void trigger();
  }, [trigger]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [
    errors,
    errors.desktopUrl,
    errors.tabletUrl,
    errors.mobileUrl,
    errors.altText,
    onValidationChange,
  ]);

  useEffect(() => {
    reset(image);
  }, [image, reset]);

  return (
    <div>
      <TextField
        {...register('mobileUrl', {
          required: `${EMPTY_ERROR_HELPER_TEXT} - ${imageGuidance?.mobileUrlGuidance}`,
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

import { TextField } from '@mui/material';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BannerDesignImage } from '../../../models/bannerDesign';

interface Props {
  image: BannerDesignImage;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
  onChange: (image: BannerDesignImage) => void;
}

export const ImageEditor: React.FC<Props> = ({
  image,
  isDisabled,
  onValidationChange,
  onChange,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<BannerDesignImage>({
    mode: 'onChange',
    defaultValues: image,
  });
  // We have to register the kind field, or it will be lost onChange
  register('kind', { required: true, setValueAs: () => 'Image' });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors]);

  useEffect(() => {
    // necessary to reset fields if user discards changes
    reset(image);
  }, [image]);

  return (
    <div>
      <TextField
        error={errors?.mobileUrl !== undefined}
        helperText={errors?.mobileUrl?.message}
        {...register('mobileUrl', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        onBlur={handleSubmit(onChange)}
        label="Banner Image URL (Mobile)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        error={errors?.tabletUrl !== undefined}
        helperText={errors?.tabletUrl?.message}
        {...register('tabletUrl', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        onBlur={handleSubmit(onChange)}
        label="Banner Image URL (Tablet)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        error={errors?.desktopUrl !== undefined}
        helperText={errors?.desktopUrl?.message}
        {...register('desktopUrl', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        onBlur={handleSubmit(onChange)}
        label="Banner Image URL (Desktop and above)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        error={errors?.altText !== undefined}
        helperText={errors?.altText?.message}
        {...register('altText', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        onBlur={handleSubmit(onChange)}
        label="Banner Image Description (alt text)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
    </div>
  );
};

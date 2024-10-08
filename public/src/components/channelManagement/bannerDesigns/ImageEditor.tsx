import { TextField } from '@mui/material';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BannerDesignImage } from '../../../models/bannerDesign';

const imageUrlValidation = {
  value: /^https:\/\/i\.guim\.co\.uk\//,
  message: 'Images must be valid URLs hosted on https://i.guim.co.uk/',
};

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
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BannerDesignImage>({
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
        inputRef={register('mobileUrl', {
          required: EMPTY_ERROR_HELPER_TEXT,
          pattern: imageUrlValidation,
        })}
        error={errors?.mobileUrl !== undefined}
        helperText={errors?.mobileUrl?.message}
        onBlur={handleSubmit(onChange)}
        name="mobileUrl"
        label="Banner Image URL (Mobile)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        inputRef={register('tabletUrl', {
          required: EMPTY_ERROR_HELPER_TEXT,
          pattern: imageUrlValidation,
        })}
        error={errors?.tabletUrl !== undefined}
        helperText={errors?.tabletUrl?.message}
        onBlur={handleSubmit(onChange)}
        name="tabletUrl"
        label="Banner Image URL (Tablet)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        inputRef={register('desktopUrl', {
          required: EMPTY_ERROR_HELPER_TEXT,
          pattern: imageUrlValidation,
        })}
        error={errors?.desktopUrl !== undefined}
        helperText={errors?.desktopUrl?.message}
        onBlur={handleSubmit(onChange)}
        name="desktopUrl"
        label="Banner Image URL (Desktop and above)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        inputRef={register('altText', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        error={errors?.altText !== undefined}
        helperText={errors?.altText?.message}
        onBlur={handleSubmit(onChange)}
        name="altText"
        label="Banner Image Description (alt text)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
    </div>
  );
};

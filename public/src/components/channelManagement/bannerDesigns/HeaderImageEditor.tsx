import { FormControl, FormControlLabel, RadioGroup, Radio, TextField } from '@mui/material';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BannerDesignHeaderImage } from '../../../models/bannerDesign';

export const DEFAULT_HEADER_IMAGE_SETTINGS: BannerDesignHeaderImage = {
  mobileUrl: '',
  tabletUrl: '',
  desktopUrl: '',
  altText: '',
};

interface Props {
  headerImage?: BannerDesignHeaderImage;
  isDisabled: boolean;
  onValidationChange: (fieldName: string, isValid: boolean) => void;
  onChange: (headerImage: BannerDesignHeaderImage | undefined) => void;
}

export const HeaderImageEditor: React.FC<Props> = ({
  headerImage,
  isDisabled,
  onValidationChange,
  onChange,
}: Props) => {
  const defaultValues: BannerDesignHeaderImage = {
    mobileUrl: headerImage?.mobileUrl ?? '',
    tabletUrl: headerImage?.tabletUrl ?? '',
    desktopUrl: headerImage?.desktopUrl ?? '',
    altText: headerImage?.altText ?? '',
  };

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<BannerDesignHeaderImage>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange('BannerHeaderImage', isValid);
  }, [errors.mobileUrl, errors.tabletUrl, errors.desktopUrl, errors.altText]);

  useEffect(() => {
    reset(defaultValues);
  }, [
    defaultValues.mobileUrl,
    defaultValues.tabletUrl,
    defaultValues.desktopUrl,
    defaultValues.altText,
  ]);

  const onSubmit = ({
    mobileUrl,
    tabletUrl,
    desktopUrl,
    altText,
  }: BannerDesignHeaderImage): void => {
    onChange({ mobileUrl, tabletUrl, desktopUrl, altText });
  };

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'enabled') {
      onChange(DEFAULT_HEADER_IMAGE_SETTINGS);
    } else {
      onChange(undefined);
    }
  };

  return (
    <div>
      <FormControl>
        <RadioGroup value={headerImage ? 'enabled' : 'disabled'} onChange={onRadioGroupChange}>
          <FormControlLabel
            value="disabled"
            key="disabled"
            control={<Radio />}
            label="Do not include a header image"
            disabled={isDisabled}
          />
          <FormControlLabel
            value="enabled"
            key="enabled"
            control={<Radio />}
            label="Define the header image"
            disabled={isDisabled}
          />
        </RadioGroup>
      </FormControl>

      {headerImage && (
        <>
          <TextField
            error={errors?.mobileUrl !== undefined}
            helperText={errors?.mobileUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            {...register('mobileUrl', {
              required: EMPTY_ERROR_HELPER_TEXT,
            })}
            label="Header Image URL (Mobile)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            error={errors?.tabletUrl !== undefined}
            helperText={errors?.tabletUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            {...register('tabletUrl', {
              required: EMPTY_ERROR_HELPER_TEXT,
            })}
            label="Header Image URL (Tablet)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            error={errors?.desktopUrl !== undefined}
            helperText={errors?.desktopUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            {...register('desktopUrl', {
              required: EMPTY_ERROR_HELPER_TEXT,
            })}
            label="Header Image URL (Dekstop and above)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            error={errors?.altText !== undefined}
            helperText={errors?.altText?.message}
            onBlur={handleSubmit(onSubmit)}
            {...register('altText', {
              required: EMPTY_ERROR_HELPER_TEXT,
            })}
            label="Header Image Description (alt text)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
        </>
      )}
    </div>
  );
};

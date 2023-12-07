import { FormControl, FormControlLabel, RadioGroup, Radio, TextField } from '@material-ui/core';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BannerDesignHeaderImage } from '../../../models/bannerDesign';

const imageUrlValidation = {
  value: /^https:\/\/i\.guim\.co\.uk\//,
  message: 'Images must be valid URLs hosted on https://i.guim.co.uk/',
};

export const DEFAULT_HEADER_IMAGE_SETTINGS: BannerDesignHeaderImage = {
  mobileUrl: '',
  tabletDesktopUrl: '',
  wideUrl: '',
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
    tabletDesktopUrl: headerImage?.tabletDesktopUrl ?? '',
    wideUrl: headerImage?.wideUrl ?? '',
    altText: headerImage?.altText ?? '',
  };

  const { register, handleSubmit, errors, reset } = useForm<BannerDesignHeaderImage>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange('BannerHeaderImage', isValid);
  }, [errors.mobileUrl, errors.tabletDesktopUrl, errors.wideUrl, errors.altText]);

  useEffect(() => {
    reset(defaultValues);
  }, [
    defaultValues.mobileUrl,
    defaultValues.tabletDesktopUrl,
    defaultValues.wideUrl,
    defaultValues.altText,
  ]);

  const onSubmit = ({
    mobileUrl,
    tabletDesktopUrl,
    wideUrl,
    altText,
  }: BannerDesignHeaderImage): void => {
    onChange({ mobileUrl, tabletDesktopUrl, wideUrl, altText });
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
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
              pattern: imageUrlValidation,
            })}
            error={errors?.mobileUrl !== undefined}
            helperText={errors?.mobileUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="mobileUrl"
            label="Header Image URL (Mobile)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
              pattern: imageUrlValidation,
            })}
            error={errors?.tabletDesktopUrl !== undefined}
            helperText={errors?.tabletDesktopUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="tabletDesktopUrl"
            label="Header Image URL (Tablet & Desktop)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
              pattern: imageUrlValidation,
            })}
            error={errors?.wideUrl !== undefined}
            helperText={errors?.wideUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="wideUrl"
            label="Header Image URL (Wide)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
            })}
            error={errors?.altText !== undefined}
            helperText={errors?.altText?.message}
            onBlur={handleSubmit(onSubmit)}
            name="altText"
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

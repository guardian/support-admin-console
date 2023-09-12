import React, { useEffect } from 'react';
import { TextField, Typography } from '@material-ui/core';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { useForm } from 'react-hook-form';
import { BannerDesign } from '../../../models/bannerDesign';
import {
  BannerDesignImageFormData as ImageFormData,
  DEFAULT_BANNER_DESIGN,
} from './utils/defaults';
import { useStyles } from '../helpers/testEditorStyles';

type Props = {
  design: BannerDesign;
  setValidationStatus: (scope: string, isValid: boolean) => void;
  isDisabled: boolean;
  onChange: (design: BannerDesign) => void;
};

const imageUrlValidation = {
  value: /^https:\/\/i\.guim\.co\.uk\//,
  message: 'Images must be valid URLs hosted on https://i.guim.co.uk/',
};

const BannerDesignForm: React.FC<Props> = ({
  design,
  setValidationStatus,
  isDisabled,
  onChange,
}: Props) => {
  const classes = useStyles();

  const onValidationChange = (isValid: boolean): void => {
    const validationScope = design.name;
    setValidationStatus(validationScope, isValid);
  };

  const defaultValues: ImageFormData = {
    mobileUrl: design.image.mobileUrl || DEFAULT_BANNER_DESIGN.mobileUrl,
    tabletDesktopUrl: design.image.tabletDesktopUrl || DEFAULT_BANNER_DESIGN.tabletDesktopUrl,
    wideUrl: design.image.wideUrl || DEFAULT_BANNER_DESIGN.wideUrl,
    altText: design.image.altText || DEFAULT_BANNER_DESIGN.altText,
  };

  const { register, handleSubmit, errors, reset } = useForm<ImageFormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [design]);

  const onSubmit = (formData: ImageFormData): void => {
    onChange({ ...design, image: formData });
  };

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.mobileUrl, errors.tabletDesktopUrl, errors.wideUrl, errors.altText]);

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Images
        </Typography>
        <div>
          <TextField
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
              pattern: imageUrlValidation,
            })}
            error={errors.mobileUrl !== undefined}
            helperText={errors.mobileUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="mobileUrl"
            label="Banner Image URL (Mobile)"
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
            error={errors.tabletDesktopUrl !== undefined}
            helperText={errors.tabletDesktopUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="tabletDesktopUrl"
            label="Banner Image URL (Tablet & Desktop)"
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
            error={errors.wideUrl !== undefined}
            helperText={errors.wideUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="wideUrl"
            label="Banner Image URL (Wide)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
            })}
            error={errors.altText !== undefined}
            helperText={errors.altText?.message}
            onBlur={handleSubmit(onSubmit)}
            name="altText"
            label="Banner Image Description (alt text)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default BannerDesignForm;

import React, { useEffect } from 'react';
import { TextField, Typography } from '@material-ui/core';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { useForm } from 'react-hook-form';
import { BannerDesign } from '../../../models/bannerDesign';
import {
  BannerDesignFormData,
  BannerDesignFormData as FormData,
  DEFAULT_BANNER_DESIGN,
} from './utils/defaults';
import { useStyles } from '../helpers/testEditorStyles';
import {
  hexColourToString,
  hexColourStringRegex,
  stringToHexColour,
} from '../../../utils/bannerDesigns';
import { makeStyles, Theme } from '@material-ui/core/styles';

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

const colourValidation = {
  value: hexColourStringRegex,
  message: 'Colours must be a valid 6 character hex code e.g. FF0000',
};

export const useLocalStyles = makeStyles(({}: Theme) => ({
  colourSectionContainer: {
    '& input': {
      textTransform: 'uppercase',
    },
  },
}));

const BannerDesignForm: React.FC<Props> = ({
  design,
  setValidationStatus,
  isDisabled,
  onChange,
}: Props) => {
  const classes = useStyles();
  const localClasses = useLocalStyles();

  const onValidationChange = (isValid: boolean): void => {
    const validationScope = design.name;
    setValidationStatus(validationScope, isValid);
  };

  const defaultValues: BannerDesignFormData = {
    image: {
      mobileUrl: design.image.mobileUrl || DEFAULT_BANNER_DESIGN.image.mobileUrl,
      tabletDesktopUrl:
        design.image.tabletDesktopUrl || DEFAULT_BANNER_DESIGN.image.tabletDesktopUrl,
      wideUrl: design.image.wideUrl || DEFAULT_BANNER_DESIGN.image.wideUrl,
      altText: design.image.altText || DEFAULT_BANNER_DESIGN.image.altText,
    },
    colours: {
      basic: {
        background:
          hexColourToString(design.colours.basic.background) ||
          DEFAULT_BANNER_DESIGN.colours.basic.background,
        bodyText:
          hexColourToString(design.colours.basic.bodyText) ||
          DEFAULT_BANNER_DESIGN.colours.basic.bodyText,
      },
    },
  };

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [design]);

  const onSubmit = (formData: FormData): void => {
    try {
      onChange({
        ...design,
        image: formData.image,
        colours: {
          basic: {
            background: stringToHexColour(formData.colours.basic.background),
            bodyText: stringToHexColour(formData.colours.basic.bodyText),
          },
        },
      });
    } catch (e) {
      // We don't expect to get here as the form validation should have caught invalid hex colour strings
      alert(`Something went wrong saving banner design: ${e}`);
    }
  };

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [
    errors?.image?.mobileUrl,
    errors?.image?.tabletDesktopUrl,
    errors?.image?.wideUrl,
    errors?.image?.altText,
    errors?.colours?.basic?.bodyText,
    errors?.colours?.basic?.background,
  ]);

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
            error={errors?.image?.mobileUrl !== undefined}
            helperText={errors?.image?.mobileUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="image.mobileUrl"
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
            error={errors?.image?.tabletDesktopUrl !== undefined}
            helperText={errors?.image?.tabletDesktopUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="image.tabletDesktopUrl"
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
            error={errors?.image?.wideUrl !== undefined}
            helperText={errors?.image?.wideUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="image.wideUrl"
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
            error={errors?.image?.altText !== undefined}
            helperText={errors?.image?.altText?.message}
            onBlur={handleSubmit(onSubmit)}
            name="image.altText"
            label="Banner Image Description (alt text)"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
        </div>
      </div>
      <div className={[classes.sectionContainer, localClasses.colourSectionContainer].join(' ')}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Basic Colours
        </Typography>
        <div>
          <TextField
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
              pattern: colourValidation,
            })}
            error={errors?.colours?.basic?.background !== undefined}
            helperText={errors?.colours?.basic?.background?.message}
            onBlur={handleSubmit(onSubmit)}
            name="colours.basic.background"
            label="Background Colour"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
              pattern: colourValidation,
            })}
            error={errors?.colours?.basic?.bodyText !== undefined}
            helperText={errors?.colours?.basic?.bodyText?.message}
            onBlur={handleSubmit(onSubmit)}
            name="colours.basic.bodyText"
            label="Body Text Colour"
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

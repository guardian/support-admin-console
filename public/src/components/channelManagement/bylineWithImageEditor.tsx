import React, { useEffect } from 'react';
import { Checkbox, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useForm } from 'react-hook-form';
import { EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';
import FormControlLabel from '@mui/material/FormControlLabel';
import { BylineWithImage } from './helpers/shared';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    marginBottom: spacing(3),
  },
}));

interface BylineWithImageEditorProps {
  bylineWithImage: BylineWithImage;
  updateBylineWithImage: (bylineWithImage: BylineWithImage) => void;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const DEFAULT_BYLINE: BylineWithImage = {
  name: '',
};

const BylineWithImageEditor: React.FC<BylineWithImageEditorProps> = ({
  bylineWithImage,
  updateBylineWithImage,
  isDisabled,
  onValidationChange,
}: BylineWithImageEditorProps) => {
  const defaultValues: BylineWithImage = bylineWithImage ?? {
    name: '',
  };

  const {
    register,
    handleSubmit,
    trigger,
    getValues,

    formState: { errors },
  } = useForm<BylineWithImage>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger(); // validate immediately
  }, []);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.name, errors.description, errors.headshot]);

  const update = (byline: BylineWithImage): void => {
    if (!byline.headshot?.mainUrl && !byline.headshot?.altText) {
      updateBylineWithImage({
        ...byline,
        headshot: undefined,
      });
    } else {
      updateBylineWithImage(byline);
    }
  };

  return (
    <div>
      <TextField
        error={errors.name !== undefined}
        helperText={errors.name?.message}
        {...register('name', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        onBlur={handleSubmit(update)}
        label="Name"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        {...register('description')}
        onBlur={handleSubmit(update)}
        label="Title or description"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <p>
        Note: if including a headshot image alongside the byline, both of the following fields
        should be completed
      </p>
      <TextField
        error={errors?.headshot?.mainUrl !== undefined}
        helperText={
          errors?.headshot?.mainUrl?.message ??
          'Image dimensions should be roughly square, with a transparent background'
        }
        {...register('headshot.mainUrl', {
          validate: (mainUrl) => {
            // required if altText is set
            if (!mainUrl && getValues().headshot?.altText) {
              return 'Required if alt-text is set';
            }
            return true;
          },
        })}
        onBlur={handleSubmit(update)}
        label="Image URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        error={errors?.headshot?.altText !== undefined}
        helperText={errors?.headshot?.altText?.message ?? ''}
        {...register('headshot.altText', {
          validate: (altText) => {
            // required if mainUrl is set
            if (!altText && getValues().headshot?.mainUrl) {
              return 'Required if image url is set';
            }
            return true;
          },
        })}
        onBlur={handleSubmit(update)}
        label="Image alt-text"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
    </div>
  );
};

interface BylineWithImageEditorToggleProps {
  bylineWithImage?: BylineWithImage;
  updateBylineWithImage: (bylineWithImage?: BylineWithImage) => void;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
  label: string;
}

/**
 * Component for toggling the use of an byline component.
 * Renders the BylineWithImageEditor component if the checkbox is checked.
 */
const BylineWithImageEditorToggle: React.FC<BylineWithImageEditorToggleProps> = ({
  bylineWithImage,
  updateBylineWithImage,
  isDisabled,
  onValidationChange,
  label,
}: BylineWithImageEditorToggleProps) => {
  const classes = useStyles();

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    if (isChecked) {
      updateBylineWithImage(DEFAULT_BYLINE);
    } else {
      updateBylineWithImage(undefined);
      onValidationChange(true);
    }
  };

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!bylineWithImage}
            onChange={onCheckboxChanged}
            color="primary"
            disabled={isDisabled}
          />
        }
        label={label}
      />

      {bylineWithImage && (
        <BylineWithImageEditor
          bylineWithImage={bylineWithImage}
          updateBylineWithImage={updateBylineWithImage}
          isDisabled={isDisabled}
          onValidationChange={onValidationChange}
        />
      )}
    </div>
  );
};

export { BylineWithImageEditorToggle };

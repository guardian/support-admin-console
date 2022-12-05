import React, { useEffect } from 'react';
import { Checkbox, makeStyles, TextField, Theme } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
  guidance: string; // helper text to suggest e.g. image ratio
}

const DEFAULT_BYLINE: BylineWithImage = {
  name: '',
};

const BylineWithImageEditor: React.FC<BylineWithImageEditorProps> = ({
  bylineWithImage,
  updateBylineWithImage,
  isDisabled,
  onValidationChange,
  guidance,
}: BylineWithImageEditorProps) => {
  const generateDefaultValues = () => {
    const obj: BylineWithImage = {
      name: bylineWithImage.name || '',
    }
    if (bylineWithImage.description != null) {
      obj.description = bylineWithImage.description;
    }
    if (bylineWithImage.headshot != null) {
      obj.headshot = {
        mainUrl: bylineWithImage.headshot.mainUrl,
        altText: bylineWithImage.headshot.altText,
      };
    }
    return obj;
  }
  const defaultValues: BylineWithImage = generateDefaultValues();

  const { register, handleSubmit, errors, trigger } = useForm<BylineWithImage>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger(); // validate immediately
  }, []);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors]);

  return (
    <div>
      <TextField
        inputRef={register({
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        error={errors.name !== undefined}
        helperText={errors.name?.message ?? guidance}
        onBlur={handleSubmit(updateBylineWithImage)}
        name="name"
        label="Name"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        inputRef={register()}
        onBlur={handleSubmit(updateBylineWithImage)}
        name="description"
        label="Title or description"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        inputRef={register()}
        onBlur={handleSubmit(updateBylineWithImage)}
        name="headshot.mainUrl"
        label="Image URL"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <TextField
        inputRef={register()}
        onBlur={handleSubmit(updateBylineWithImage)}
        name="headshot.altText"
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
  guidance: string;
  label: string;
}

/**
 * Component for toggling the use of an image.
 * Renders the ImageEditor component if the checkbox is checked.
 */
const BylineWithImageEditorToggle: React.FC<BylineWithImageEditorToggleProps> = ({
  bylineWithImage,
  updateBylineWithImage,
  isDisabled,
  onValidationChange,
  label,
  guidance,
}: BylineWithImageEditorToggleProps) => {
  const classes = useStyles();

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    console.log('onCheckboxChanged #1', isChecked);
    if (isChecked) {
    console.log('onCheckboxChanged #2', DEFAULT_BYLINE);
      updateBylineWithImage(DEFAULT_BYLINE);
    } else {
    console.log('onCheckboxChanged #3');
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
          guidance={guidance}
        />
      )}
      
    </div>
  );
};

export { BylineWithImageEditorToggle };

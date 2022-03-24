import { Image } from './helpers/shared';
import React, { useEffect } from 'react';
import { Checkbox, makeStyles, TextField, Theme } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    marginBottom: spacing(3),
  },
}));

interface ImageEditorProps {
  image: Image;
  updateImage: (image: Image) => void;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
  guidance: string;
}

interface ImageEditorContainerProps {
  image?: Image;
  updateImage: (image?: Image) => void;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
  guidance: string;
  label: string;
}

const DEFAULT_IMAGE: Image = {
  mainUrl: '',
  altText: '',
};

const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  updateImage,
  isDisabled,
  onValidationChange,
  guidance,
}: ImageEditorProps) => {
  const defaultValues: Image = image;

  const { register, handleSubmit, errors, trigger } = useForm<Image>({
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
        error={errors.mainUrl !== undefined}
        helperText={errors.mainUrl?.message ?? guidance}
        onBlur={handleSubmit(updateImage)}
        name="mainUrl"
        label="Image URL"
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
        onBlur={handleSubmit(updateImage)}
        name="altText"
        label="Image alt-text"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
    </div>
  );
};

/**
 * Component for toggling the use of an image.
 * Renders the ImageEditor component if the checkbox is checked.
 */
const ImageEditorToggle: React.FC<ImageEditorContainerProps> = ({
  image,
  updateImage,
  isDisabled,
  onValidationChange,
  label,
  guidance,
}: ImageEditorContainerProps) => {
  const classes = useStyles();

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    if (isChecked) {
      updateImage(DEFAULT_IMAGE);
    } else {
      updateImage(undefined);
      onValidationChange(true);
    }
  };

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!image}
            onChange={onCheckboxChanged}
            color="primary"
            disabled={isDisabled}
          />
        }
        label={label}
      />
      {image && (
        <ImageEditor
          image={image}
          updateImage={updateImage}
          isDisabled={isDisabled}
          onValidationChange={onValidationChange}
          guidance={guidance}
        />
      )}
    </div>
  );
};

export { ImageEditorToggle };

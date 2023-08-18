import React, { useEffect } from 'react';
import { TextField, Typography } from '@material-ui/core';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { useForm } from 'react-hook-form';
import { BannerDesign } from '../../../models/BannerDesign';
import { BannerDesignFormData as FormData, DEFAULT_BANNER_DESIGN } from './utils/defaults';
import { useStyles } from '../helpers/testEditorStyles';

type Props = {
  design: BannerDesign;
  setValidationStatus: (scope: string, isValid: boolean) => void;
  isDisabled: boolean;
  onChange: (design: BannerDesign) => void;
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

  const defaultValues: FormData = {
    imageUrl: design.imageUrl || DEFAULT_BANNER_DESIGN.imageUrl,
  };

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [design]);

  const onSubmit = ({ imageUrl }: FormData): void => {
    onChange({ ...design, imageUrl });
  };

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.imageUrl]);

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
            })}
            error={errors.imageUrl !== undefined}
            helperText={errors.imageUrl?.message}
            onBlur={handleSubmit(onSubmit)}
            name="imageUrl"
            label="Banner Image URL"
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

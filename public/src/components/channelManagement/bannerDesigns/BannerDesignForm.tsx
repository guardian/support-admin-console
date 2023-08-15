import React, { useEffect } from 'react';
import { makeStyles, TextField, Theme } from '@material-ui/core';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { useForm } from 'react-hook-form';
import { BannerDesign } from '../../../models/BannerDesign';

const useStyles = makeStyles(({ palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper, // #FFFFFF
    borderLeft: `1px solid ${palette.grey[500]}`,
  },
}));

type Props = {
  design: BannerDesign;
  setValidationStatus: (scope: string, isValid: boolean) => void;
  isDisabled: boolean;
  onChange: (design: BannerDesign) => void;
};

type FormData = {
  imageUrl: string;
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
    imageUrl: design.imageUrl,
  };

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset({
      imageUrl: design.imageUrl,
    });
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
  );
};

export default BannerDesignForm;

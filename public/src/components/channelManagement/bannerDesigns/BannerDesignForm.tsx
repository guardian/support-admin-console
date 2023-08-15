import React from 'react';
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
  setValidationStatusForField: (fieldName: string, isValid: boolean) => void;
  isDisabled: boolean;
  onChange: (design: BannerDesign) => void;
};

type FormData = {
  imageUrl: string;
};

const BannerDesignForm: React.FC<Props> = ({
  design,
  setValidationStatusForField,
  isDisabled,
  onChange,
}: Props) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    imageUrl: design.imageUrl,
  };

  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onChange', defaultValues });

  const onSubmit = ({ imageUrl }: FormData): void => {
    onChange({ ...design, imageUrl });
  };

  return (
    <div className={classes.container}>
      <TextField
        inputRef={register({
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        error={errors.imageUrl !== undefined}
        helperText={errors.imageUrl?.message}
        onBlur={() => handleSubmit(onSubmit)}
        name="imageUrl"
        label="Banner Image URL"
        margin="normal"
        variant="outlined"
        fullWidth
        disabled={isDisabled}
      />
    </div>
  );
};

export default BannerDesignForm;

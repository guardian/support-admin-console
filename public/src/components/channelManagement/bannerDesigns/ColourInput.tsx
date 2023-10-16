import React, { useEffect } from 'react';

import { TextField } from '@material-ui/core';
import {
  hexColourStringRegex,
  hexColourToString,
  stringToHexColour,
} from '../../../utils/bannerDesigns';
import { useForm } from 'react-hook-form';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { HexColour } from '../../../models/bannerDesign';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles<Theme, { colour: string }>(({ palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '16px',
  },
  colour: props => ({
    border: `1px solid ${palette.grey[500]}`,
    borderRadius: '4px',
    width: '55px',
    height: '55px',
    marginBottom: '8px',
    backgroundColor: props.colour,
  }),
  field: {
    width: '240px',
    marginTop: 0,
  },
}));

const colourValidation = {
  value: hexColourStringRegex,
  message: 'Colours must be a valid 6 character hex code e.g. FF0000',
};

interface Props {
  colour?: HexColour;
  name: string;
  label: string;
  isDisabled: boolean;
  onChange: (colour: HexColour) => void;
  onValidationChange: (fieldName: string, isValid: boolean) => void;
  required: boolean;
}

export const ColourInput: React.FC<Props> = ({
  colour,
  name,
  label,
  isDisabled,
  onChange,
  onValidationChange,
  required = true,
}: Props) => {
  const classes = useStyles({ colour: `#${colour ? hexColourToString(colour) : 'ffffff'}` });
  const defaultValues = { colour: colour ? hexColourToString(colour) : '' };
  const { register, reset, handleSubmit, errors } = useForm<{ colour: string }>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(name, isValid);
  }, [errors]);

  useEffect(() => {
    // necessary to reset fields if user discards changes
    reset(defaultValues);
  }, [colour]);

  return (
    <div className={classes.container}>
      <TextField
        className={classes.field}
        inputRef={register({
          required: required ? EMPTY_ERROR_HELPER_TEXT : false,
          pattern: colourValidation,
        })}
        name="colour"
        onBlur={handleSubmit(({ colour }) => onChange(stringToHexColour(colour)))}
        label={label}
        error={errors?.colour !== undefined}
        helperText={errors?.colour?.message}
        margin="normal"
        variant="outlined"
        fullWidth={false}
        disabled={isDisabled}
        required={required}
      />
      {colour && <div className={classes.colour} />}
    </div>
  );
};

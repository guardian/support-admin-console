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
    <TextField
      inputRef={register({
        required: required ?? EMPTY_ERROR_HELPER_TEXT,
        pattern: colourValidation,
      })}
      name="colour"
      onBlur={handleSubmit(({ colour }) => onChange(stringToHexColour(colour)))}
      label={label}
      error={errors?.colour !== undefined}
      helperText={errors?.colour?.message}
      margin="normal"
      variant="outlined"
      fullWidth
      disabled={isDisabled}
      required={required}
    />
  );
};

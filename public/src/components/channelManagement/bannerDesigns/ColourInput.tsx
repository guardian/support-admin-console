import React from 'react';

import { TextField } from '@material-ui/core';
import { hexColourStringRegex } from '../../../utils/bannerDesigns';
import { Control, useController } from 'react-hook-form';

const colourValidation = {
  value: hexColourStringRegex,
  message: 'Colours must be a valid 6 character hex code e.g. FF0000',
};

interface Props {
  control: Control;
  name: string;
  label: string;
  error?: string;
  isDisabled: boolean;
  onBlur: () => void;
}

export const ColourInput: React.FC<Props> = ({
  control,
  name,
  label,
  error,
  isDisabled,
  onBlur,
}: Props) => {
  const {
    field: { ref, onChange, value },
  } = useController({
    name,
    control,
    rules: {
      required: true,
      pattern: colourValidation,
    },
  });

  return (
    <TextField
      name={name}
      value={value}
      onBlur={onBlur}
      onChange={x => {
        onChange(x.target.value);
      }}
      inputRef={ref}
      label={label}
      error={error !== undefined}
      helperText={error}
      margin="normal"
      variant="outlined"
      fullWidth
      disabled={isDisabled}
    />
  );
};

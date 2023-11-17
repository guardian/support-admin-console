import React, { useEffect } from 'react';

import { TextField } from '@material-ui/core';
import {
  hexColourStringRegex,
  hexColourToString,
  stringToHexColour,
} from '../../../utils/bannerDesigns';
import { useForm } from 'react-hook-form';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { HexColour } from '../../../models/bannerDesign';
import { ClassNameMap } from '@mui/material';

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

interface Props<T> {
  colour: T;
  name: string;
  label: string;
  isDisabled: boolean;
  onChange: (colour: T) => void;
  onValidationChange: (fieldName: string, isValid: boolean) => void;
}

interface GenericProps<T> extends Props<T> {
  convertToString: (colour: T) => string;
  convertFromString: (colourString: string) => T;
  required: boolean;
  styles: ClassNameMap<string>;
}

const GenericColourInput = <T extends unknown>({
  colour,
  name,
  label,
  isDisabled,
  onChange,
  onValidationChange,
  convertFromString,
  required,
  convertToString,
  styles: classes,
}: GenericProps<T>) => {
  const defaultValues = { colour: convertToString(colour) };

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
        onBlur={handleSubmit(({ colour }) => {
          const newColour = convertFromString(colour);
          onChange(newColour);
        })}
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

export const ColourInput: React.FC<Props<HexColour>> = (props: Props<HexColour>) => {
  return (
    <GenericColourInput
      {...props}
      required={true}
      convertToString={hexColourToString}
      convertFromString={stringToHexColour}
      styles={useStyles({ colour: `#${hexColourToString(props.colour)}` })}
    />
  );
};

export const OptionalColourInput: React.FC<Props<HexColour | undefined>> = (
  props: Props<HexColour | undefined>,
) => {
  return (
    <GenericColourInput
      {...props}
      required={false}
      convertToString={maybeHexColourToString}
      convertFromString={stringToMaybeHexColour}
      styles={useStyles({ colour: `#${maybeHexColourToString(props.colour)}` || 'FFFFFF' })}
    />
  );
};

const maybeHexColourToString = (h: HexColour | undefined): string => {
  if (h) {
    return hexColourToString(h);
  } else {
    return '';
  }
};

const stringToMaybeHexColour = (h: string): HexColour | undefined => {
  if (h) {
    return stringToHexColour(h);
  } else {
    return undefined;
  }
};

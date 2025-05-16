import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import debounce from 'lodash/debounce';
import {
  hexColourStringRegex,
  hexColourToString,
  stringToHexColour,
} from '../../../utils/bannerDesigns';
import { useForm } from 'react-hook-form';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { HexColour } from '../../../models/bannerDesign';
import { ClassNameMap, ClickAwayListener } from '@mui/material';
import { HexColorPicker } from 'react-colorful';

const useStyles = makeStyles<Theme, { colour: string; isDisabled: boolean }>(
  ({ palette }: Theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '16px',
    },
    colour: {
      border: `1px solid ${palette.grey[500]}`,
      borderRadius: '4px',
      width: '55px',
      height: '55px',
      marginBottom: '8px',
      backgroundColor: props => props.colour,
      cursor: props => (props.isDisabled ? 'not-allowed' : 'pointer'),
      position: 'relative',
    },
    field: {
      width: '240px',
      marginTop: 0,
    },
    picker: {
      position: 'absolute',
      bottom: 0,
      left: '55px',
      margin: '0px 10px',
    },
  }),
);

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
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

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

  const handleColourChange = (colour: string) => {
    const newColour = convertFromString(colour);
    onChange(newColour);
  };

  const handleColourChangeFromPicker = debounce((colour: string) => {
    // Remove the leading '#' from the colour string given by the picker
    const colourWithNoLeadingHash = colour.slice(1);
    handleColourChange(colourWithNoLeadingHash);
  }, 100);

  return (
    <div className={classes.container}>
      <TextField
        className={classes.field}
        {...register('colour', {
          required: required ? EMPTY_ERROR_HELPER_TEXT : false,
          pattern: colourValidation,
        })}
        onBlur={handleSubmit(({ colour }) => handleColourChange(colour))}
        label={label}
        error={errors?.colour !== undefined}
        helperText={errors?.colour?.message}
        margin="normal"
        variant="outlined"
        fullWidth={false}
        disabled={isDisabled}
        required={required} />
      <div className={classes.colour} onClick={() => !isDisabled && setIsPickerOpen(true)}>
        {isPickerOpen && (
          <ClickAwayListener onClickAway={() => setIsPickerOpen(false)}>
            <div className={classes.picker}>
              <HexColorPicker
                color={colour ? `#${convertToString(colour)}` : 'rgb(0, 0, 0, 0)'}
                onChange={handleColourChangeFromPicker}
              />
            </div>
          </ClickAwayListener>
        )}
      </div>
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
      styles={useStyles({
        colour: `#${hexColourToString(props.colour)}`,
        isDisabled: props.isDisabled,
      })}
    />
  );
};

export const OptionalColourInput: React.FC<Props<HexColour | undefined>> = (
  props: Props<HexColour | undefined>,
) => {
  const colourCss = props.colour ? `#${hexColourToString(props.colour)}` : 'rgb(0, 0, 0, 0)';

  return (
    <GenericColourInput
      {...props}
      required={false}
      convertToString={maybeHexColourToString}
      convertFromString={stringToMaybeHexColour}
      styles={useStyles({ colour: colourCss, isDisabled: props.isDisabled })}
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

import React from 'react';
import { FormControlLabel, FormGroup, Radio, RadioGroup } from '@material-ui/core';

// For mapping each value in T to a user-friendly label
type LabeledValues<T extends string> = {
  [value in T]: string;
};

interface TypedRadioGroupProps<T extends string> {
  selectedValue: T;
  onChange: (updatedValue: T) => void;
  isDisabled: boolean;
  labels: LabeledValues<T>;
}

// A generic RadioGroup for use with a union of strings
function TypedRadioGroup<T extends string>({
  selectedValue,
  onChange,
  isDisabled,
  labels,
}: TypedRadioGroupProps<T>): React.ReactElement<TypedRadioGroupProps<T>> {
  return (
    <FormGroup>
      <RadioGroup value={selectedValue}>
        {(Object.entries(labels) as [T, string][]) // Cast necessary because Object.entries loses the types
          .map(([value, label]) => (
            <FormControlLabel
              value={value}
              key={value}
              control={<Radio />}
              label={label}
              disabled={isDisabled}
              onChange={() => onChange(value)}
            />
          ))}
      </RadioGroup>
    </FormGroup>
  );
}

export default TypedRadioGroup;

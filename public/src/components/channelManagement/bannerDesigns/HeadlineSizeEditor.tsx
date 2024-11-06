import { FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import React from 'react';
import { Font } from '../../../models/bannerDesign';

interface Props {
  headerSize?: Font['size'];
  isDisabled: boolean;
  // onValidationChange: (fieldName: string, isValid: boolean) => void;
  onChange: (headerSize: Font['size']) => void;
}

export const HeadlineSizeEditor: React.FC<Props> = ({
  headerSize,
  isDisabled,
  // onValidationChange, // TODO: is this needed?
  onChange,
}: Props) => {
  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'small') {
      console.log('selected small');
      onChange('small');
    } else {
      console.log('selected medium');
      onChange('medium');
    }
  };

  return (
    <div>
      <FormControl>
        <RadioGroup
          value={headerSize === 'small' ? 'small' : 'medium'}
          onChange={onRadioGroupChange}
        >
          <FormControlLabel
            name="small"
            value="small"
            // key="disabled"
            control={<Radio />}
            label="Small heading size - use for tiny banners without copy"
            disabled={isDisabled}
          />
          <FormControlLabel
            name="medium"
            value="medium"
            // key="enabled"
            control={<Radio />}
            label="Medium heading size (default)"
            disabled={isDisabled}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

import { FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import React from 'react';
import { FontSize } from '../../../models/bannerDesign';

interface Props {
  headerSize?: FontSize;
  isDisabled: boolean;
  onChange: (headerSize: FontSize) => void;
}

export const HeadlineSizeEditor: React.FC<Props> = ({
  headerSize,
  isDisabled,
  onChange,
}: Props) => {
  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'small') {
      onChange('small');
    } else {
      onChange('medium');
    }
  };

  return (
    <div>
      <FormControl>
        <RadioGroup
          defaultValue={'medium'}
          value={headerSize === 'small' ? 'small' : 'medium'}
          onChange={onRadioGroupChange}
        >
          <FormControlLabel
            name="small"
            value="small"
            key="small"
            control={<Radio />}
            label="Small heading size - use for tiny banners without body copy"
            disabled={isDisabled}
          />
          <FormControlLabel
            name="medium"
            value="medium"
            key="medium"
            control={<Radio />}
            label="Medium heading size (default)"
            disabled={isDisabled}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

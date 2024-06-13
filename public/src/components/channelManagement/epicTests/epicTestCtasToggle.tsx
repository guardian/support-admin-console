import { EpicVariant } from '../../../models/epic';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';

interface EpicTestCtasToggleProps {
  variant: EpicVariant;
  isDisabled: boolean;
  onVariantChange: (variant: EpicVariant) => void;
}

export const EpicTestCtasToggle: React.FC<EpicTestCtasToggleProps> = ({
  variant,
  isDisabled,
  onVariantChange,
}) => {
  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    if (value === 'newsletterSignup') {
      onVariantChange({ ...variant, newsletterSignup: { text: '', newsletterUrl: '' } });
    } else {
      onVariantChange({ ...variant, newsletterSignup: undefined });
    }
  };
  return (
    <div>
      <FormControl>
        <RadioGroup
          value={variant.newsletterSignup ? 'newsletterSignup' : 'buttons'}
          onChange={onRadioGroupChange}
        >
          <FormControlLabel
            value="newsletterSignup"
            key="newsletterSignup"
            control={<Radio />}
            label="Newsletter signup"
            disabled={isDisabled}
          />
          <FormControlLabel
            value="buttons"
            key="buttons"
            control={<Radio />}
            label="Buttons"
            disabled={isDisabled}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

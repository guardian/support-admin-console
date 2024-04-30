import React from 'react';

import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { EpicTest } from '../../../models/epic';

interface EpicBanditEditorProps {
  test: EpicTest;
  isDisabled: boolean;
  onExperimentMethodologyChange: (isBanditTest?: boolean) => void;
}

export const EpicBanditEditor: React.FC<EpicBanditEditorProps> = ({
  test,
  isDisabled,
  onExperimentMethodologyChange,
}: EpicBanditEditorProps) => {
  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'bandit') {
      onExperimentMethodologyChange(true);
    } else {
      onExperimentMethodologyChange(false);
    }
  };

  return (
    <RadioGroup value={test.isBanditTest ? 'bandit' : 'abtest'} onChange={onRadioGroupChange}>
      <FormControlLabel
        value="abtest"
        key="abtest"
        control={<Radio />}
        label="AB Testing"
        disabled={isDisabled}
      />
      <FormControlLabel
        value="bandit"
        key="bandit"
        control={<Radio />}
        label="Multi-Armed Bandit"
        disabled={isDisabled}
      />
    </RadioGroup>
  );
};

import React from 'react';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { EpicTest } from '../../models/epic';
import { BannerTest } from '../../models/banner';

interface BanditEditorProps {
  test: EpicTest | BannerTest;
  isDisabled: boolean;
  onExperimentMethodologyChange: (isBanditTest?: boolean) => void;
}

export const BanditEditor: React.FC<BanditEditorProps> = ({
  test,
  isDisabled,
  onExperimentMethodologyChange,
}: BanditEditorProps) => {
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

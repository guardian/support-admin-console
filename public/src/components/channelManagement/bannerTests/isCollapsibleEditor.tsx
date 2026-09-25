import { Box, Radio, RadioGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import React from 'react';
import { BannerStepMode } from '../../../models/banner';
import { getBannerStepMode } from './utils/bannerStepMode';

const Container = styled(Box)(({ theme }) => ({
  '& > * + *': {
    marginTop: theme.spacing(1),
  },
}));

interface IsCollapsibleEditorProps {
  isCollapsible?: boolean;
  bannerStepMode?: BannerStepMode;
  isDisabled: boolean;
  updateBannerStepModeSettings: (bannerStepMode: BannerStepMode) => void;
}

const IsCollapsibleEditor: React.FC<IsCollapsibleEditorProps> = ({
  isCollapsible,
  bannerStepMode,
  isDisabled,
  updateBannerStepModeSettings,
}: IsCollapsibleEditorProps) => {
  const onChange = (_: React.ChangeEvent<HTMLInputElement>, value: string): void => {
    updateBannerStepModeSettings(value as BannerStepMode);
  };

  return (
    <Container>
      <RadioGroup value={getBannerStepMode(bannerStepMode, isCollapsible)} onChange={onChange}>
        <FormControlLabel
          value={BannerStepMode.OneStep}
          control={<Radio />}
          label="One-step only"
          disabled={isDisabled}
        />
        <FormControlLabel
          value={BannerStepMode.TwoStep}
          control={<Radio />}
          label="Two-step only"
          disabled={isDisabled}
        />
        <FormControlLabel
          value={BannerStepMode.TwoStepIfAllowed}
          control={<Radio />}
          label="Two-step if allowed, otherwise one-step"
          disabled={isDisabled}
        />
      </RadioGroup>
    </Container>
  );
};

export default IsCollapsibleEditor;

import { Switch, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(5),
}));
const SwitchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
const OnOffLabel = styled(Typography)({
  fontSize: '14px',
  fontWeight: 500,
});

interface LiveSwitchProps {
  isLive: boolean;
  label: string;
  isDisabled: boolean;
  onChange: (isLive: boolean) => void;
}

const LiveSwitch: React.FC<LiveSwitchProps> = ({
  isLive,
  label,
  isDisabled,
  onChange,
}: LiveSwitchProps) => {
  return (
    <Container>
      <Typography>{label}</Typography>

      <SwitchContainer>
        <OnOffLabel>Off</OnOffLabel>
        <Switch
          checked={isLive}
          onChange={(e): void => onChange(e.target.checked)}
          disabled={isDisabled}
        />
        <OnOffLabel>On</OnOffLabel>
      </SwitchContainer>
    </Container>
  );
};

export default LiveSwitch;

import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../hooks/useOpenable';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
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
const DialogHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: '8px',
});

interface LiveSwitchProps {
  isLive: boolean;
  onChange: (isLive: boolean) => void;
  disabled: boolean;
}

const TestLiveSwitch: React.FC<LiveSwitchProps> = ({
  isLive,
  onChange,
  disabled,
}: LiveSwitchProps) => {
  const [isOpen, open, close] = useOpenable();

  const onSubmit = () => {
    onChange(!isLive);
    close();
  };

  return (
    <Container>
      <Typography>Status on theguardian.com:</Typography>

      <SwitchContainer>
        <OnOffLabel>Draft</OnOffLabel>
        <Switch checked={isLive} onChange={open} disabled={disabled} />
        <OnOffLabel>Live</OnOffLabel>

        <Dialog open={isOpen} onClose={close}>
          <DialogHeader>
            <DialogTitle>Change test status</DialogTitle>
            <IconButton onClick={close} aria-label="close">
              <CloseIcon />
            </IconButton>
          </DialogHeader>
          <DialogContent dividers>
            {`This will ${
              isLive ? 'disable' : 'enable'
            } this test on the site with immediate effect - are you sure?`}
          </DialogContent>
          <DialogActions>
            <Button onClick={close} color="primary">
              Cancel
            </Button>
            <Button onClick={onSubmit} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </SwitchContainer>
    </Container>
  );
};

export default TestLiveSwitch;

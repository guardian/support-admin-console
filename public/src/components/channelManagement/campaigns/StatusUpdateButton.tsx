import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { Test } from '../helpers/shared';
import StatusUpdateDialog from './StatusUpdateDialog';

const StyledButton = styled(Button)({
  justifyContent: 'start',
  height: '36px',
});

const Text = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

interface StatusUpdateButtonProps {
  tests: Test[];
  updatePage: () => void;
}

const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({
  tests,
  updatePage,
}: StatusUpdateButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <StyledButton variant="contained" onClick={open}>
        <Text>Update Test statuses on theguardian.com</Text>
      </StyledButton>
      <StatusUpdateDialog isOpen={isOpen} close={close} tests={tests} updatePage={updatePage} />
    </>
  );
};

export default StatusUpdateButton;

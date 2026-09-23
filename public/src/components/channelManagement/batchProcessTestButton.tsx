import ArchiveIcon from '@mui/icons-material/Archive';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../hooks/useOpenable';
import BatchProcessTestDialog from './batchProcessTestDialog';
import { Test } from './helpers/shared';

const StyledButton = styled(Button)({
  justifyContent: 'start',
  height: '48px',
});

const Text = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

interface BatchProcessTestButtonProps {
  draftTests: Test[];
  onBatchTestArchive: (batchTestNames: string[]) => void;
  disabled: boolean;
}

const BatchProcessTestButton: React.FC<BatchProcessTestButtonProps> = ({
  draftTests,
  onBatchTestArchive,
  disabled,
}: BatchProcessTestButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  return (
    <>
      <StyledButton
        variant="outlined"
        startIcon={<ArchiveIcon />}
        onClick={open}
        disabled={disabled}
      >
        <Text>Batch archive tests</Text>
      </StyledButton>
      <BatchProcessTestDialog
        isOpen={isOpen}
        close={close}
        draftTests={draftTests}
        onBatchTestArchive={onBatchTestArchive}
      />
    </>
  );
};

export default BatchProcessTestButton;

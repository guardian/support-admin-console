import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../hooks/useOpenable';
import CreateTestDialog from './createTestDialog';

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

interface NewTestButtonProps {
  existingNames: string[];
  existingNicknames: string[];
  testNamePrefix?: string;
  createTest: (name: string, nickname: string, campaignName?: string) => void;
  disabled: boolean;
}

const NewTestButton: React.FC<NewTestButtonProps> = ({
  existingNames,
  existingNicknames,
  testNamePrefix,
  createTest,
  disabled,
}: NewTestButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  return (
    <>
      <StyledButton variant="outlined" startIcon={<AddIcon />} onClick={open} disabled={disabled}>
        <Text>Create a new test</Text>
      </StyledButton>
      <CreateTestDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        existingNicknames={existingNicknames}
        testNamePrefix={testNamePrefix}
        createTest={createTest}
        mode="NEW"
      />
    </>
  );
};

export default NewTestButton;

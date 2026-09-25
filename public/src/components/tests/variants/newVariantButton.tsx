import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import CreateVariantDialog from '../../channelManagement/createVariantDialog';

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'start',
  border: `1px dashed ${theme.palette.grey[700]}`,
  borderRadius: '4px',
  padding: '12px 16px',
}));
const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
const Text = styled(Typography)({
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 1,
  textTransform: 'uppercase',
});

interface NewVariantButtonProps {
  existingNames: string[];
  createVariant: (name: string) => void;
  isDisabled: boolean;
}

const NewVariantButton: React.FC<NewVariantButtonProps> = ({
  existingNames,
  createVariant,
  isDisabled,
}: NewVariantButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <StyledButton onClick={open} disabled={isDisabled}>
        <Container>
          <AddIcon />
          <Text>New variant</Text>
        </Container>
      </StyledButton>
      <CreateVariantDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        createVariant={createVariant}
        mode={'NEW'}
      />
    </>
  );
};

export default NewVariantButton;

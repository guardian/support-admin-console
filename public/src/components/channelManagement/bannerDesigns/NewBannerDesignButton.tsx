import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import CreateBannerDesignDialog from './CreateBannerDesignDialog';

const StyledButton = styled(Button)({
  justifyContent: 'start',
  height: '48px',
});

const Text = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '1px',
});

interface Props {
  existingNames: string[];
  createDesign: (name: string) => void;
}

const NewCampaignButton: React.FC<Props> = ({ existingNames, createDesign }: Props) => {
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <StyledButton variant="outlined" startIcon={<AddIcon />} onClick={open}>
        <Text>Create a new banner design</Text>
      </StyledButton>
      <CreateBannerDesignDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        createDesign={createDesign}
      />
    </>
  );
};

export default NewCampaignButton;

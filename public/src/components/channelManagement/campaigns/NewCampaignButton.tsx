import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { Campaign } from './CampaignsTypes';
import CreateCampaignDialog from './CreateCampaignDialog';

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

interface NewCampaignButtonProps {
  existingNames: string[];
  existingNicknames: string[];
  createCampaign: (campaign: Campaign) => void;
}

const NewCampaignButton: React.FC<NewCampaignButtonProps> = ({
  existingNames,
  existingNicknames,
  createCampaign,
}: NewCampaignButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <StyledButton variant="outlined" startIcon={<AddIcon />} onClick={open}>
        <Text>Create a new campaign</Text>
      </StyledButton>
      <CreateCampaignDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        existingNicknames={existingNicknames}
        createCampaign={createCampaign}
      />
    </>
  );
};

export default NewCampaignButton;

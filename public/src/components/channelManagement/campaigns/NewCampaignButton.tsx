import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { Campaign } from './CampaignsForm';
import CreateCampaignDialog from './CreateCampaignDialog';

const useStyles = makeStyles(() => ({
  button: {
    justifyContent: 'start',
    height: '48px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

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
  const classes = useStyles();

  return (
    <>
      <Button className={classes.button} variant="outlined" startIcon={<AddIcon />} onClick={open}>
        <Typography className={classes.text}>Create a new campaign</Typography>
      </Button>
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

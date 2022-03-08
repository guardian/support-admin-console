import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import CreateCampaignDialog from './CreateCampaignDialog';
import useOpenable from '../../../hooks/useOpenable';

const useStyles = makeStyles(() => ({
  container: {
    marginBottom: '12px',
  },
  button: {
    borderStyle: 'dashed',
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
  createCampaign: (name: string) => void;
}

const NewCampaignButton: React.FC<NewCampaignButtonProps> = ({
  existingNames,
  createCampaign,
}: NewCampaignButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Button className={classes.button} variant="outlined" startIcon={<AddIcon />} onClick={open}>
        <Typography className={classes.text}>Create a new campaign</Typography>
      </Button>
      <CreateCampaignDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        createCampaign={createCampaign}
      />
    </div>
  );
};

export default NewCampaignButton;

import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useOpenable from '../../../hooks/useOpenable';
import { BannerDesign } from '../../../models/BannerDesign';
import CreateBannerDesignDialog from './CreateBannerDesignDialog';

const useStyles = makeStyles(() => ({
  button: {
    justifyContent: 'start',
    height: '48px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '1px',
  },
}));

interface Props {
  existingNames: string[];
  createDesign: (campaign: BannerDesign) => void;
}

const NewCampaignButton: React.FC<Props> = ({ existingNames, createDesign }: Props) => {
  const [isOpen, open, close] = useOpenable();
  const classes = useStyles();

  return (
    <>
      <Button className={classes.button} variant="outlined" startIcon={<AddIcon />} onClick={open}>
        <Typography className={classes.text}>Create a new banner design</Typography>
      </Button>
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

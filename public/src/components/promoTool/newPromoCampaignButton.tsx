import React from 'react';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
// import { PromoCampaign } from './utils/promoModels';
import useOpenable from '../../hooks/useOpenable';
// import CreateCampaignDialog from '../channelManagement/campaigns/CreateCampaignDialog';
import CreatePromoCampaignDialog from './createPromoCampaignDialog';

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

// interface NewPromoCampaignButtonProps {
//   existingNames: string[]; // and existing promoCodes?
//   createPromoCampaign: (campaign: PromoCampaign) => void;
// }

// const NewCampaignButton: React.FC<NewPromoCampaignButtonProps> = ({
// //   existingNames,
// //   createPromoCampaign,
// }: NewPromoCampaignButtonProps) => {

const NewPromoCampaignButton: React.FC = () => {
  const [isOpen, open, close] = useOpenable();
  const classes = useStyles();

  console.log(isOpen, close); // TODO: to stop annoying stuff.

  return (
    <>
      <Button className={classes.button} variant="outlined" startIcon={<AddIcon />} onClick={open}>
        <Typography className={classes.text}>Create new promo campaign</Typography>
      </Button>
      <CreatePromoCampaignDialog
      // isOpen={isOpen}
      // close={close}
      // existingNames={existingNames}
      // createPromoCampaign={createPromoCampaign}
      />
    </>
  );
};

export default NewPromoCampaignButton;

// TODO: carry on with this

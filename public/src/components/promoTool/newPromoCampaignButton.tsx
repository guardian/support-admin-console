import React from 'react';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import useOpenable from '../../hooks/useOpenable';
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

const NewPromoCampaignButton: React.FC = () => {
  const [isOpen, open, close] = useOpenable();
  const classes = useStyles();

  return (
    <>
      <Button
        className={classes.button}
        variant="outlined"
        startIcon={<AddIcon className="classes.icon" />}
        onClick={open}
      >
        <Typography className={classes.text}>Create new promo campaign</Typography>
      </Button>
      <CreatePromoCampaignDialog
        isOpen={isOpen}
        close={close}
        existingNames={[]} // TODO
        createPromoCampaign={() => {}} // TODO
      />
    </>
  );
};

export default NewPromoCampaignButton;

// TODO: carry on with this

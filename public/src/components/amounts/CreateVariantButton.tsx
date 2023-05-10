import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { CreateVariantDialog } from './createVariantDialog';
import useOpenable from '../../hooks/useOpenable';

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

interface CreateVariantButtonProps {
  createVariant: (name: string) => void;
  existingNames: string[];
}

export const CreateVariantButton: React.FC<CreateVariantButtonProps> = ({
  createVariant,
  existingNames,
}: CreateVariantButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  const classes = useStyles();
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={open}
      >
        <Typography className={classes.text}>Add variant</Typography>
      </Button>
      <CreateVariantDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        createVariant={createVariant}
      />
    </>
  );
};

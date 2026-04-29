import React from 'react';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DeleteVariantDialog } from './DeleteVariantDialog';
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

interface DeleteVariantButtonProps {
  variantName: string;
  confirmDeletion: () => void;
}

export const DeleteVariantButton: React.FC<DeleteVariantButtonProps> = ({
  variantName,
  confirmDeletion,
}: DeleteVariantButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  const classes = useStyles();
  return (
    <>
      <Button variant="contained" color="primary" className={classes.button} onClick={open}>
        <Typography className={classes.text}>Delete variant</Typography>
      </Button>
      <DeleteVariantDialog
        variantName={variantName}
        isOpen={isOpen}
        close={close}
        confirmDeletion={confirmDeletion}
      />
    </>
  );
};

import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteTestDialog from './DeleteTestDialog';
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

interface DeleteTestButtonProps {
  testName: string;
  confirmDeletion: () => void;
}

export const DeleteTestButton: React.FC<DeleteTestButtonProps> = ({
  testName,
  confirmDeletion,
}: DeleteTestButtonProps) => {
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
        <Typography className={classes.text}>Delete test</Typography>
      </Button>
      <DeleteTestDialog
        testName={testName}
        isOpen={isOpen}
        close={close}
        confirmDeletion={confirmDeletion}
      />
    </>
  );
};

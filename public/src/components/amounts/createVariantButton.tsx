import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateVariantDiaglog from './createVariantDialog';
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
  onCreate: (name: string) => void;
  existingNames: string[];
}

const CreateVariantButton: React.FC<CreateVariantButtonProps> = ({
  onCreate,
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
        <Typography className={classes.text}>Create a new variant</Typography>
      </Button>
      <CreateVariantDiaglog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        createTest={onCreate}
      />
    </>
  );
};

export default CreateVariantButton;

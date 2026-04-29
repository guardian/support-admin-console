import React from 'react';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import { CreateTestDialog } from './CreateTestDialog';
import useOpenable from '../../hooks/useOpenable';

const useStyles = makeStyles(() => ({
  button: {
    justifyContent: 'start',
    height: '48px',
    marginBottom: '8px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

interface CreateTestButtonProps {
  create: (name: string, label: string) => void;
  checkTestNameIsUnique: (name: string) => boolean;
  checkTestLabelIsUnique: (name: string) => boolean;
}

export const CreateTestButton: React.FC<CreateTestButtonProps> = ({
  create,
  checkTestNameIsUnique,
  checkTestLabelIsUnique,
}: CreateTestButtonProps) => {
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
        <Typography className={classes.text}>Create a new test</Typography>
      </Button>
      <CreateTestDialog
        isOpen={isOpen}
        close={close}
        checkTestNameIsUnique={checkTestNameIsUnique}
        checkTestLabelIsUnique={checkTestLabelIsUnique}
        create={create}
      />
    </>
  );
};

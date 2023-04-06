import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateTestDiaglog from './createTestDialog';
import useOpenable from '../../hooks/useOpenable';
import { Territory } from '../../utils/models';

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

interface CreateTestButtonProps {
  create: (name: string) => void;
  candidateTargets: Territory[];
}

const CreateTestButton: React.FC<CreateTestButtonProps> = ({
  create,
  candidateTargets,
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
      <CreateTestDiaglog
        isOpen={isOpen}
        close={close}
        candidateTargets={candidateTargets}
        create={create}
      />
    </>
  );
};

export default CreateTestButton;

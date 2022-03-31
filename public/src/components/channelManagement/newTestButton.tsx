import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import CreateTestDialog from './createTestDialog';
import useOpenable from '../../hooks/useOpenable';

const useStyles = makeStyles(() => ({
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

interface NewTestButtonProps {
  existingNames: string[];
  existingNicknames: string[];
  testNamePrefix?: string;
  createTest: (name: string, nickname: string) => void;
}

const NewTestButton: React.FC<NewTestButtonProps> = ({
  existingNames,
  existingNicknames,
  testNamePrefix,
  createTest,
}: NewTestButtonProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();
  return (
    <>
      <Button variant="outlined" className={classes.button} startIcon={<AddIcon />} onClick={open}>
        <Typography className={classes.text}>Create a new test</Typography>
      </Button>
      <CreateTestDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        existingNicknames={existingNicknames}
        testNamePrefix={testNamePrefix}
        createTest={createTest}
        mode="NEW"
      />
    </>
  );
};

export default NewTestButton;

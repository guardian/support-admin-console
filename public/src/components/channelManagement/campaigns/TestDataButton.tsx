import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

import { Test } from '../helpers/shared';
import TestDataDialog from './TestDataDialog';
import useOpenable from '../../../hooks/useOpenable';

const useStyles = makeStyles(() => ({
  button: {
    backgroundColor: '#fafbff',
  },
}));

interface TestDataButtonProps {
  test: Test;
}

const TestDataButton: React.FC<TestDataButtonProps> = ({ test }: TestDataButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  const classes = useStyles();

  return (
    <>
      <Button className={classes.button} variant="contained" onClick={open}>
        View data
      </Button>
      <TestDataDialog isOpen={isOpen} close={close} test={test} />
    </>
  );
};

export default TestDataButton;

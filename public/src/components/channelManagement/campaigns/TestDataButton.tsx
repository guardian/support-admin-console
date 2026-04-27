import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { Test } from '../helpers/shared';
import { formattedTimestamp } from '../helpers/utilities';
import TestDataDialog from './TestDataDialog';

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

  const datetimeStamp = formattedTimestamp(Date());

  return (
    <>
      <Button className={classes.button} variant="contained" onClick={open}>
        View data
      </Button>
      <TestDataDialog isOpen={isOpen} close={close} test={test} datetimeStamp={datetimeStamp} />
    </>
  );
};

export default TestDataButton;

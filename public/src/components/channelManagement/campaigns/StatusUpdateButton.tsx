import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';

import { Test } from '../helpers/shared';
import StatusUpdateDialog from './StatusUpdateDialog';
import useOpenable from '../../../hooks/useOpenable';

const useStyles = makeStyles(() => ({
  button: {
    justifyContent: 'start',
    height: '36px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

interface StatusUpdateButtonProps {
  tests: Test[];
  updatePage: () => void;
}

const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({
  tests,
  updatePage,
}: StatusUpdateButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  const classes = useStyles();

  return (
    <>
      <Button className={classes.button} variant="outlined" onClick={open}>
        <Typography className={classes.text}>Update Test statuses on theguardian.com</Typography>
      </Button>
      <StatusUpdateDialog isOpen={isOpen} close={close} tests={tests} updatePage={updatePage} />
    </>
  );
};

export default StatusUpdateButton;

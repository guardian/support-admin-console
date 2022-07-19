import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';

import { Test } from '../helpers/shared';
import ArchivedTestDialog from './ArchivedTestDialog';
import useOpenable from '../../../hooks/useOpenable';

const useStyles = makeStyles(() => ({
  button: {
    // justifyContent: 'start',
    // height: '36px',
    backgroundColor: '#fafbff',
  },
  // text: {
  //   fontSize: '12px',
  //   fontWeight: 500,
  //   textTransform: 'uppercase',
  //   letterSpacing: '1px',
  // },
  // linkButtonBackground: {
  //   backgroundColor: '#fafbff',
  // },
  // linkButton: {
  //   textDecoration: 'none',
  // },
}));

interface ArchivedTestButtonProps {
  test: Test;
}

const ArchivedTestButton: React.FC<ArchivedTestButtonProps> = ({
  test,
}: ArchivedTestButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  const classes = useStyles();

  return (
    <>
      <Button className={classes.button} variant="contained" onClick={open}>
        {!test.nickname ? test.name : test.nickname}
      </Button>
      <ArchivedTestDialog isOpen={isOpen} close={close} test={test} />
    </>
  );
};

export default ArchivedTestButton;

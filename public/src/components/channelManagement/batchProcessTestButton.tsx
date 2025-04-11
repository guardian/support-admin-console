import React from 'react';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Test } from './helpers/shared';
import ArchiveIcon from '@mui/icons-material/Archive';

import BatchProcessTestDialog from './batchProcessTestDialog';
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

interface BatchProcessTestButtonProps {
  draftTests: Test[];
  onBatchTestArchive: (batchTestNames: string[]) => void;
  disabled: boolean;
}

const BatchProcessTestButton: React.FC<BatchProcessTestButtonProps> = ({
  draftTests,
  onBatchTestArchive,
  disabled,
}: BatchProcessTestButtonProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();
  return (
    <>
      <Button
        variant="outlined"
        className={classes.button}
        startIcon={<ArchiveIcon />}
        onClick={open}
        disabled={disabled}
      >
        <Typography className={classes.text}>Batch archive tests</Typography>
      </Button>
      <BatchProcessTestDialog
        isOpen={isOpen}
        close={close}
        draftTests={draftTests}
        onBatchTestArchive={onBatchTestArchive}
      />
    </>
  );
};

export default BatchProcessTestButton;

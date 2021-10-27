import React from 'react';
import { Button, createStyles, Typography, WithStyles, withStyles } from '@material-ui/core';
import { Test } from './helpers/shared';
import ArchiveIcon from '@material-ui/icons/Archive';

import BatchProcessTestDialog from './batchProcessTestDialog';
import useOpenable from '../../hooks/useOpenable';

const styles = createStyles({
  button: {
    borderStyle: 'dashed',
    justifyContent: 'start',
    height: '48px',
    marginTop: '8px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
});

interface BatchProcessTestButtonProps extends WithStyles<typeof styles> {
  draftTests: Test[];
  tests: Test[];
  onBatchTestDelete: (batchTestNames: string[]) => void;
  onBatchTestArchive: (batchTestNames: string[]) => void;
}

const BatchProcessTestButton: React.FC<BatchProcessTestButtonProps> = ({
  classes,
  draftTests,
  tests,
  onBatchTestDelete,
  onBatchTestArchive,
}: BatchProcessTestButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  return (
    <>
      <Button
        variant="outlined"
        className={classes.button}
        startIcon={<ArchiveIcon />}
        onClick={open}
      >
        <Typography className={classes.text}>Batch archive/delete tests</Typography>
      </Button>
      <BatchProcessTestDialog
        isOpen={isOpen}
        close={close}
        draftTests={draftTests}
        tests={tests}
        onBatchTestDelete={onBatchTestDelete}
        onBatchTestArchive={onBatchTestArchive}
      />
    </>
  );
};

export default withStyles(styles)(BatchProcessTestButton);

import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  // TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Test } from '../helpers/shared';

const useStyles = makeStyles(() => ({
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
  input: {
    '& input': {
      textTransform: 'uppercase !important',
    },
  },
}));

interface StatusUpdateDialogProps {
  isOpen: boolean;
  close: () => void;
  tests: Test[];
}

interface TestStatus {
  [index: string]: string;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  isOpen,
  close,
  tests,
}: StatusUpdateDialogProps) => {
  const classes = useStyles();

  const oldTestStatuses: TestStatus = {};

  const [testData, setTestData] = useState<TestStatus>(oldTestStatuses);

  const getStatusKey = (test: Test) => {
    return `${test.channel}|${test.name}`;
  };

  useEffect(() => {
    tests.map(test => {
      const key = getStatusKey(test);
      oldTestStatuses[key] = test.status;
    });
    setTestData(oldTestStatuses);
  }, [tests]);

  const onSubmit = (): void => {
    console.log(testData, tests);
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-campaign-dialog-title">Update Test status values</DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>Clicking on the update button will change Test statuses on the site with immediate effect - are you sure?</DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} color="primary">
          Update now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdateDialog;

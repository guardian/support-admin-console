import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { Test } from './helpers/shared';
import CloseIcon from '@material-ui/icons/Close';
import useOpenable from '../../hooks/useOpenable';

const styles = createStyles({
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
});

type FormData = {
  selectedTests: Test[];
};

interface BatchProcessTestDialogProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  close: () => void;
  draftTests: Test[];
  tests: Test[];
  onBatchTestDelete: (batchTestNames: string) => void;
  onBatchTestArchive: (batchTestNames: string) => void;
}

const BatchProcessTestDialog: React.FC<BatchProcessTestDialogProps> = ({
  classes,
  isOpen,
  close,
  draftTests,
  onBatchTestDelete,
  onBatchTestArchive,
}: BatchProcessTestDialogProps) => {
  const defaultValues = {
    selectedTests: [],
  };

  const { handleSubmit } = useForm<FormData>({
    defaultValues,
  });

  const currentSelectedTests: Test[] = [];

  const [checked, setChecked] = useState([-1]);
  const [selectedBatchProcess, setSelectedBatchProcess] = useState('');
  const [selectedTests, setSelectedTests] = useState(currentSelectedTests);

  const getSelectedTests = (): Test[] => {
    currentSelectedTests.length = 0;

    checked.forEach(i => {
      if (i >= 0) {
        currentSelectedTests.push(draftTests[i]);
      }
    });
    return currentSelectedTests;
  };

  const getSelectedTestNames = (): string => {
    if (!selectedTests) {
      return '';
    }

    const namesArray: string[] = [];
    selectedTests.forEach(t => namesArray.push(t.name));
    return namesArray.join(', ');
  };

  const [isConfirmOpen, confirmOpen, confirmClose] = useOpenable();

  const onArchiveSubmit = (): void => {
    setSelectedTests(getSelectedTests());
    setSelectedBatchProcess('ARCHIVE');
    confirmOpen();
  };

  const completeArchiveSubmit = (): void => {
    confirmClose();
    const selectedNames = getSelectedTestNames();
    onBatchTestArchive(selectedNames);
    setSelectedBatchProcess('');
    setChecked([-1]);
    close();
  };

  const onDeleteSubmit = (): void => {
    setSelectedTests(getSelectedTests());
    setSelectedBatchProcess('DELETE');
    confirmOpen();
  };

  const completeDeleteSubmit = (): void => {
    const selectedNames = getSelectedTestNames();
    confirmClose();
    onBatchTestDelete(selectedNames);
    setSelectedBatchProcess('');
    setChecked([-1]);
    close();
  };

  const onCancel = (): void => {
    setChecked([-1]);
    close();
  };

  const handleToggle = (value: number) => (): void => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex < 0) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const isDelete = (): boolean => {
    if (selectedBatchProcess === 'DELETE') {
      return true;
    }
    return false;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      fullWidth={true}
      maxWidth="sm"
      aria-labelledby="batch-process-dialog-title"
    >
      <div className={classes.dialogHeader}>
        <DialogTitle id="batch-process-dialog-title">Batch archive or delete tests</DialogTitle>
        <IconButton onClick={onCancel} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <List>
          {draftTests.map((t, index) => {
            const labelId = `checkbox-label-${t.name}`,
              value = index;

            return (
              <ListItem key={value} onClick={handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={t.nickname || t.name} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <Dialog
        open={isConfirmOpen}
        onClose={confirmClose}
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="batch-process-dialog-confirm-title"
      >
        <div className={classes.dialogHeader}>
          <DialogTitle id="batch-process-dialog-title">
            Batch {isDelete() ? 'delete' : 'archive'} tests
          </DialogTitle>
          <IconButton onClick={confirmClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent dividers>
          <Typography>
            Please confirm. The following tests will be{' '}
            <strong>{isDelete() ? 'deleted' : 'archived'}</strong>:
          </Typography>
          <ul>
            {selectedTests.map((t, i) => (
              <li key={i}>{t.nickname || t.name}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit(confirmClose)} color="primary">
            Cancel
          </Button>
          {isDelete() ? (
            <Button onClick={handleSubmit(completeDeleteSubmit)} color="secondary">
              Delete
            </Button>
          ) : (
            <Button onClick={handleSubmit(completeArchiveSubmit)} color="secondary">
              Archive
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <DialogActions>
        <Button onClick={handleSubmit(onCancel)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onArchiveSubmit)} color="secondary">
          Archive
        </Button>
        <Button onClick={handleSubmit(onDeleteSubmit)} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(BatchProcessTestDialog);

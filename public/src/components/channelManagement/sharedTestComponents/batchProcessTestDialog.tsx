import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Test } from '../helpers/shared';
import CloseIcon from '@mui/icons-material/Close';
import useOpenable from '../../../hooks/useOpenable';

const useStyles = makeStyles(() => ({
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
}));

interface BatchProcessTestDialogProps {
  isOpen: boolean;
  close: () => void;
  draftTests: Test[];
  onBatchTestArchive: (batchTestNames: string[]) => void;
}

const BatchProcessTestDialog: React.FC<BatchProcessTestDialogProps> = ({
  isOpen,
  close,
  draftTests,
  onBatchTestArchive,
}: BatchProcessTestDialogProps) => {
  const classes = useStyles();

  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isConfirmOpen, confirmOpen, confirmClose] = useOpenable();

  const onArchiveSubmit = (): void => {
    confirmOpen();
  };

  const completeArchiveSubmit = (): void => {
    confirmClose();
    onBatchTestArchive([...selectedTests]);
    setSelectedTests([]);
    close();
  };

  const onCancel = (): void => {
    setSelectedTests([]);
    close();
  };

  const handleToggle = (value: string) => (): void => {
    const valueIndex = selectedTests.indexOf(value),
      currentSelected = [...selectedTests];

    if (valueIndex < 0) {
      currentSelected.push(value);
    } else {
      currentSelected.splice(valueIndex, 1);
    }
    setSelectedTests(currentSelected);
  };

  const getTestNickname = (name: string): string => {
    const test = draftTests.find(t => name === t.name);

    if (test) {
      return test.nickname || name;
    }
    return name;
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
        <DialogTitle id="batch-process-dialog-title">Batch archive tests</DialogTitle>
        <IconButton onClick={onCancel} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <List>
          {draftTests.map((t, index) => {
            const labelId = `checkbox-label-${t.name}`;

            return (
              <ListItem key={index}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedTests.indexOf(t.name) >= 0}
                    inputProps={{ 'aria-labelledby': labelId }}
                    onChange={handleToggle(t.name)}
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
          <DialogTitle id="batch-process-dialog-title">Batch archive tests</DialogTitle>
          <IconButton onClick={confirmClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent dividers>
          <Typography>
            Please confirm. The following tests will be <strong>archived</strong>:
          </Typography>
          <ul>
            {selectedTests.map((t, i) => (
              <li key={i}>{getTestNickname(t)}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={completeArchiveSubmit} color="secondary">
            Archive
          </Button>
        </DialogActions>
      </Dialog>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onArchiveSubmit} color="secondary">
          Archive
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BatchProcessTestDialog;

import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DeleteTestDialogProps {
  testName: string;
  isOpen: boolean;
  close: (response: boolean) => void;
  confirmDeletion: () => void;
}

const DeleteTestDialog: React.FC<DeleteTestDialogProps> = ({
  testName,
  isOpen,
  close,
  confirmDeletion,
}: DeleteTestDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title" fullWidth>
      <DialogTitle id="delete-variant-dialog-title">Delete test: {testName}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          Be aware that once you delete this test, its settings and data will be lost forever!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => confirmDeletion()} color="primary">
          Delete
        </Button>
        <Button onClick={() => close(true)} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTestDialog;

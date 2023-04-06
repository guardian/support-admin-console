import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({}));

interface DeleteTestDialogProps {
  isOpen: boolean;
  close: (response: boolean) => void;
}

const DeleteTestDialog: React.FC<DeleteTestDialogProps> = ({
  isOpen,
  close,
}: DeleteTestDialogProps) => {
  const classes = useStyles();

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title" fullWidth>
      <DialogTitle id="delete-variant-dialog-title">Delete test variant</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          Be aware that once you delete this country test, its settings and data are lost forever!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close(true)} color="primary">
          Delete
        </Button>
        <Button onClick={() => close(false)} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTestDialog;

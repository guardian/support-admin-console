import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

interface VariantEditorButtonsEditorProps {
  onDelete: () => void;
}

const VariantEditorButtonsEditor: React.FC<VariantEditorButtonsEditorProps> = ({
  onDelete,
}: VariantEditorButtonsEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = (): void => setIsOpen(true);
  const close = (): void => setIsOpen(false);

  const submit = (): void => {
    onDelete();
    close();
  };

  return (
    <>
      <IconButton onClick={open}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby="delete-variant-dialog-title"
        aria-describedby="delete-variant-dialog-description"
      >
        <DialogTitle id="delete-variant-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-variant-dialog-description">
            Deleting this variant will remove it from the test permanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={close}>
            Cancel
          </Button>
          <Button color="primary" onClick={submit}>
            Delete variant
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VariantEditorButtonsEditor;

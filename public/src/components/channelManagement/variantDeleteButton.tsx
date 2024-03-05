import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import useOpenable from '../../hooks/useOpenable';

interface VariantEditorButtonsEditorProps {
  isDisabled: boolean;
  onConfirm: () => void;
}

const VariantEditorButtonsEditor: React.FC<VariantEditorButtonsEditorProps> = ({
  isDisabled,
  onConfirm,
}: VariantEditorButtonsEditorProps) => {
  const [isOpen, open, close] = useOpenable();

  const submit = (): void => {
    onConfirm();
    close();
  };

  return (
    <>
      <Button variant="outlined" onClick={open} disabled={isDisabled}>
        Delete variant
      </Button>
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VariantEditorButtonsEditor;

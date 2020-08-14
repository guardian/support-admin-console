import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

interface VariantEditorButtonsEditorProps {
  isDisabled: boolean;
}

const VariantEditorButtonsEditor: React.FC<VariantEditorButtonsEditorProps> = ({
  isDisabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setIsOpen(true)} disabled={isDisabled}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="delete-variant-dialog-title"
        aria-describedby="delete-variant-dialog-description"
      >
        <DialogTitle id="delete-variant-dialog-title">
          Are you sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-variant-dialog-description">
            Deleting this variant will remove it from the test permanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary">Cancel</Button>
          <Button color="primary" autoFocus>
            Delete variant
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VariantEditorButtonsEditor;

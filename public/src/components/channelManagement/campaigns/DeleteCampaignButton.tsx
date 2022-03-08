import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

interface DeleteCampaignButtonProps {
  onDelete: () => void;
}

const DeleteCampaignButton: React.FC<DeleteCampaignButtonProps> = ({
  onDelete,
}: DeleteCampaignButtonProps) => {
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
        aria-labelledby="delete-campaign-dialog-title"
        aria-describedby="delete-campaign-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="delete-campaign-dialog-description">
            Are you sure you want to delete this campaign?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={close}>
            Cancel
          </Button>
          <Button color="primary" onClick={submit}>
            Delete campaign
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteCampaignButton;

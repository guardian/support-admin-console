import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),
    minWidth: 400,
  },
}));

interface CreatePromoDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (promoCode: string, name: string) => void;
  existingCodes: string[];
}

const CreatePromoDialog = ({
  open,
  onClose,
  onCreate,
  existingCodes,
}: CreatePromoDialogProps): React.ReactElement => {
  const classes = useStyles();
  const [promoCode, setPromoCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!promoCode.trim()) {
      setError('Promo code is required');
      return;
    }

    if (existingCodes.includes(promoCode.trim())) {
      setError('This promo code already exists');
      return;
    }

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    onCreate(promoCode.trim(), name.trim());
    handleClose();
  };

  const handleClose = () => {
    setPromoCode('');
    setName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Promo Code</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          autoFocus
          label="Promo Code"
          value={promoCode}
          onChange={(e) => {
            setPromoCode(e.target.value);
            setError('');
          }}
          error={Boolean(error)}
          helperText={error}
          placeholder="e.g., PROMO_1"
        />
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name for internal use..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePromoDialog;

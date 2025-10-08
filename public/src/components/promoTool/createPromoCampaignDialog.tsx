import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ProductSelector } from './productSelector';

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

interface FormData {
  name: string;
}

interface CreatePromoCampaignDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  createPromoCampaign: (data: FormData) => void;
}
const CreatePromoCampaignDialog: React.FC<CreatePromoCampaignDialogProps> = ({
  isOpen,
  close,
}: CreatePromoCampaignDialogProps) => {
  const classes = useStyles();

  const [selectedProduct, setSelectedProduct] = useState('');

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-promo-campaign-dialog-title">
          Create a new promo campaign
        </DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <ProductSelector selectedValue={selectedProduct} handleSelectedValue={setSelectedProduct} />
        <TextField
          className={classes.input}
          label="Promo Campaign name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary">Create Promo Campaign</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePromoCampaignDialog;

// TODO: carry on with this next

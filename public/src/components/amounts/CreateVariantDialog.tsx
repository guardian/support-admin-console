import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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

interface CreateVariantDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  createVariant: (name: string) => void;
}

const errorMessages = {
  REQUIRED: 'Variant name required',
  DUPLICATE: 'Variant with this name already exists',
  OK: '',
};

export const CreateVariantDialog: React.FC<CreateVariantDialogProps> = ({
  isOpen,
  close,
  existingNames,
  createVariant,
}: CreateVariantDialogProps) => {
  const classes = useStyles();

  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(errorMessages.REQUIRED);

  const onSubmit = (): void => {
    if (name.length && !existingNames.includes(name)) {
      createVariant(name.toUpperCase());
      close();
    }
  };

  const updateName = (val: string) => {
    const updatedName = val.toUpperCase();
    setName(updatedName);
    if (!updatedName.length) {
      setErrorMessage(errorMessages.REQUIRED);
    } else if (existingNames.includes(updatedName)) {
      setErrorMessage(errorMessages.DUPLICATE);
    } else {
      setErrorMessage(errorMessages.OK);
    }
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-variant-dialog-title" fullWidth>
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-variant-dialog-title">Create new variant</DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <TextField
          className={classes.input}
          name="name"
          label="Variant name"
          error={!!errorMessage.length}
          helperText={errorMessage}
          margin="normal"
          variant="outlined"
          onChange={e => updateName(e.target.value)}
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} color="primary">
          Create variant
        </Button>
      </DialogActions>
    </Dialog>
  );
};

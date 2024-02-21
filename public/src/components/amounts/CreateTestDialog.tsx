import React, { useState } from 'react';
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
import CloseIcon from '@mui/icons-material/Close';

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

const errorMessages = {
  REQUIRED: 'This field cannot be left empty',
  DUPLICATE: 'A test with this name/label already exists',
  OK: '',
};

interface CreateTestDialogProps {
  isOpen: boolean;
  close: () => void;
  create: (name: string, label: string) => void;
  checkTestNameIsUnique: (name: string) => boolean;
  checkTestLabelIsUnique: (name: string) => boolean;
}

export const CreateTestDialog: React.FC<CreateTestDialogProps> = ({
  isOpen,
  close,
  checkTestNameIsUnique,
  checkTestLabelIsUnique,
  create,
}: CreateTestDialogProps) => {
  const [name, setName] = useState<string | undefined>();
  const [label, setLabel] = useState<string | undefined>();
  const [nameError, setNameError] = useState<string>(errorMessages.REQUIRED);
  const [labelError, setLabelError] = useState<string>(errorMessages.REQUIRED);

  const updateTestName = (update: string) => {
    if (!update || !update.trim()) {
      setName('');
      setNameError(errorMessages.REQUIRED);
    } else {
      setName(update.toUpperCase());
      if (checkTestNameIsUnique(update)) {
        setNameError(errorMessages.OK);
      } else {
        setNameError(errorMessages.DUPLICATE);
      }
    }
  };

  const updateTestLabel = (update: string) => {
    if (!update || !update.trim()) {
      setLabel('');
      setLabelError(errorMessages.REQUIRED);
    } else {
      setLabel(update.toUpperCase());
      if (checkTestLabelIsUnique(update)) {
        setLabelError(errorMessages.OK);
      } else {
        setLabelError(errorMessages.DUPLICATE);
      }
    }
  };

  const onSubmit = (): void => {
    if (name && label && !nameError.length && !labelError.length) {
      create(name.trim(), label.trim());
      setName(undefined);
      setLabel(undefined);
      setNameError(errorMessages.REQUIRED);
      setLabelError(errorMessages.REQUIRED);
      close();
    }
  };

  const classes = useStyles();

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title" fullWidth>
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-test-dialog-title">Create new test</DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <TextField
          className={classes.input}
          name="name"
          label="Test name"
          value={name}
          onChange={e => updateTestName(e.target.value)}
          error={!!nameError.length}
          helperText={nameError}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          className={classes.input}
          name="name"
          label="Test label"
          value={label}
          onChange={e => updateTestLabel(e.target.value)}
          error={!!labelError.length}
          helperText={labelError}
          margin="normal"
          variant="outlined"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} color="primary">
          Create test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

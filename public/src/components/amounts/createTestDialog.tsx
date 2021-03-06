import React from 'react';
import { useForm } from 'react-hook-form';
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

import {
  duplicateValidator,
  VALID_CHARACTERS_REGEX,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  EMPTY_ERROR_HELPER_TEXT,
} from '../../utils/forms';

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

type FormData = {
  name: string;
};

interface CreateTestDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  createTest: (name: string) => void;
}

const CreateTestDialog: React.FC<CreateTestDialogProps> = ({
  isOpen,
  close,
  existingNames,
  createTest,
}: CreateTestDialogProps) => {
  const defaultValues = {
    name: '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues,
  });

  const onSubmit = ({ name }: FormData): void => {
    createTest(name.toUpperCase());
    close();
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
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            pattern: {
              value: VALID_CHARACTERS_REGEX,
              message: INVALID_CHARACTERS_ERROR_HELPER_TEXT,
            },
            validate: duplicateValidator(existingNames),
          })}
          error={!!errors.name}
          helperText={errors.name && errors.name.message}
          name="name"
          label="Full test name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Create test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTestDialog;

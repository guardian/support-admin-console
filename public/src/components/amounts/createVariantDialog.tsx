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
const duplicateValidator = (existingNames: string[]) => (name: string): string | boolean => {
  const existingNamesLowerCased = existingNames.map(n => n.toLowerCase());
  if (existingNamesLowerCased.includes(name.toLowerCase())) {
    return 'Name already exists - please try another';
  }
  return true;
};

interface CreateVariantDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  createTest: (name: string) => void;
}

const CreateVariantDialog: React.FC<CreateVariantDialogProps> = ({
  isOpen,
  close,
  existingNames,
  createTest,
}: CreateVariantDialogProps) => {
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
          inputRef={register({
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
          Create variant
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVariantDialog;

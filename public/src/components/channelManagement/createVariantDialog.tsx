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
  Theme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
} from './helpers/validation';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
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

const NAME_DEFAULT_HELPER_TEXT = "Format: 'control' or 'v1_name'";

interface FormData {
  name: string;
}

type Mode = 'NEW' | 'COPY';
interface CreateVariantDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  mode: Mode;
  createVariant: (name: string) => void;
}

const CreateVariantDialog: React.FC<CreateVariantDialogProps> = ({
  isOpen,
  close,
  existingNames,
  mode,
  createVariant,
}: CreateVariantDialogProps) => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm<FormData>();

  const onSubmit = ({ name }: FormData): void => {
    close();
    createVariant(name.toUpperCase());
  };

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby="new-variant-dialog-title"
      aria-describedby="new-variant-dialog-description"
      fullWidth
    >
      <div className={classes.dialogHeader}>
        <DialogTitle id="new-variant-dialog-title">
          {mode === 'NEW' ? 'Create a new variant' : 'Clone variant'}
        </DialogTitle>
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
            validate: createDuplicateValidator(existingNames),
          })}
          error={errors.name !== undefined}
          helperText={errors.name ? errors.name.message : NAME_DEFAULT_HELPER_TEXT}
          name="name"
          label="Variant name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          {mode === 'NEW' ? 'Create variant' : 'Clone variant'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVariantDialog;

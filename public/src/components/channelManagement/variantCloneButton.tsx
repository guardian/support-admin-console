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

import { Variant } from './helpers/shared';

import useOpenable from '../../hooks/useOpenable';

import {
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
  createDuplicateValidator,
} from './helpers/validation';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
  text: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: 'uppercase',
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

interface VariantEditorButtonsEditorProps<V extends Variant> {
  existingNames: string[];
  cloneVariant: (originalVariant: V, clonedVariantName: string) => void;
  currentVariant: V;
  isDisabled: boolean;
}

function VariantEditorButtonsEditor<V extends Variant>({
  existingNames,
  cloneVariant,
  currentVariant,
  isDisabled,
}: VariantEditorButtonsEditorProps<V>): React.ReactElement<VariantEditorButtonsEditorProps<V>> {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  const { register, handleSubmit, errors } = useForm<FormData>();

  const onSubmit = ({ name }: FormData): void => {
    close();
    cloneVariant(currentVariant, name.toUpperCase());
  };

  return (
    <>
      <Button variant="outlined" onClick={open} disabled={isDisabled}>
        Clone variant
      </Button>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby="clone-variant-dialog-title"
        aria-describedby="clone-variant-dialog-description"
        fullWidth
      >
        <div className={classes.dialogHeader}>
          <DialogTitle id="clone-variant-dialog-title">Clone variant</DialogTitle>
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default VariantEditorButtonsEditor;

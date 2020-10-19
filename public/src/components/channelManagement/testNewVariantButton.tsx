import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import useOpenable from '../../hooks/useOpenable';

import {
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
  createDuplicateValidator,
} from './helpers/validation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    button: {
      width: '100%',
      display: 'flex',
      justifyContent: 'start',
      border: `1px dashed ${palette.grey[700]}`,
      borderRadius: '4px',
      padding: '12px 16px',
    },
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
  });

const NAME_DEFAULT_HELPER_TEXT = "Format: 'control' or 'v1_name'";

interface FormData {
  name: string;
}

interface BannerTestNewVariantButtonProps extends WithStyles<typeof styles> {
  existingNames: string[];
  createVariant: (name: string) => void;
  isDisabled: boolean;
}

const BannerTestNewVariantButton: React.FC<BannerTestNewVariantButtonProps> = ({
  classes,
  existingNames,
  createVariant,
  isDisabled,
}: BannerTestNewVariantButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  const { register, handleSubmit, errors } = useForm<FormData>();

  const onSubmit = ({ name }: FormData): void => {
    close();
    createVariant(name.toUpperCase());
  };

  return (
    <>
      <Button className={classes.button} onClick={open} disabled={isDisabled}>
        <div className={classes.container}>
          <AddIcon />
          <Typography className={classes.text}>New variant</Typography>
        </div>
      </Button>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby="new-variant-dialog-title"
        aria-describedby="new-variant-dialog-description"
        fullWidth
      >
        <div className={classes.dialogHeader}>
          <DialogTitle id="new-variant-dialog-title">Create a new variant</DialogTitle>
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
            Create variant
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withStyles(styles)(BannerTestNewVariantButton);

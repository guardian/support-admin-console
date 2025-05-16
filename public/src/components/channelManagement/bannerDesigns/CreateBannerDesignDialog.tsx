import React from 'react';
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
import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
} from '../helpers/validation';
import { useForm } from 'react-hook-form';

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

interface CreateBannerDesignDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  createDesign: (name: string) => void;
}

type FormData = {
  name: string;
};

const CreateBannerDesignDialog: React.FC<CreateBannerDesignDialogProps> = ({
  isOpen,
  close,
  existingNames,
  createDesign,
}: CreateBannerDesignDialogProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    name: '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues,
  });

  const onSubmit = ({ name }: FormData): void => {
    createDesign(name.toUpperCase());
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-design-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-design-dialog-title">Create a new banner design</DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <TextField
          className={classes.input}
          error={errors.name !== undefined}
          helperText={errors.name ? errors.name.message : ''}
          {...register('name', {
            required: EMPTY_ERROR_HELPER_TEXT,
            pattern: {
              value: VALID_CHARACTERS_REGEX,
              message: INVALID_CHARACTERS_ERROR_HELPER_TEXT,
            },
            validate: createDuplicateValidator(existingNames),
          })}
          label="Banner design name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Create banner design
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBannerDesignDialog;

import React from 'react';
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

interface CreateCampaignDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  createCampaign: (name: string) => void;
}

interface FormData {
  name: string;
}

const CreateCampaignDialog: React.FC<CreateCampaignDialogProps> = ({
  isOpen,
  close,
  existingNames,
  createCampaign,
}: CreateCampaignDialogProps) => {
  const classes = useStyles();

  const defaultValues = {
    name: '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues,
  });

  const onSubmit = ({ name }: FormData): void => {
    createCampaign(name.toUpperCase());
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-campaign-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-campaign-dialog-title">Create a new campaign</DialogTitle>
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
          helperText={errors.name ? errors.name.message : ''}
          name="name"
          label="Full campaign name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCampaignDialog;

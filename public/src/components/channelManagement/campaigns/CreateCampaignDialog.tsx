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

interface FormData {
  name: string;
  nickname: string;
  description: string;
}

interface CreateCampaignDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  existingNicknames: string[];
  createCampaign: (data: FormData) => void;
}

const CreateCampaignDialog: React.FC<CreateCampaignDialogProps> = ({
  isOpen,
  close,
  existingNames,
  existingNicknames,
  createCampaign,
}: CreateCampaignDialogProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    name: '',
    nickname: '',
    description: '',
  };

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
  });

  const onSubmit = (vals: FormData): void => {
    createCampaign({
      name: vals.name.toUpperCase(),
      nickname: vals.nickname.toUpperCase(),
      description: vals.description,
    });
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-campaign-dialog-title">Create a new campaign</DialogTitle>
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
          label="Campaign name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
        <TextField
          className={classes.input}
          error={errors.nickname !== undefined}
          helperText={errors.nickname ? errors.nickname.message : ''}
          {...register('nickname', {
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: createDuplicateValidator(existingNicknames),
          })}
          label="Nickname"
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          error={errors.description !== undefined}
          helperText={errors.description ? errors.description.message : ''}
          {...register('description')}
          label="Description"
          margin="normal"
          variant="outlined"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Create Campaign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCampaignDialog;

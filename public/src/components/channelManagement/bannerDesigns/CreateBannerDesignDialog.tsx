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
import { BannerDesign } from '../../../models/BannerDesign';

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
  createDesign: (data: BannerDesign) => void;
}

const CreateBannerDesignDialog: React.FC<CreateBannerDesignDialogProps> = ({
  isOpen,
  close,
  existingNames,
  createDesign,
}: CreateBannerDesignDialogProps) => {
  const classes = useStyles();

  const defaultValues: BannerDesign = {
    name: '',
    imageUrl: '',
  };

  const { register, handleSubmit, errors } = useForm<BannerDesign>({
    defaultValues,
  });

  const onSubmit = (design: BannerDesign): void => {
    createDesign({
      name: design.name,
      // Hardcode this until the form is working
      imageUrl:
        'https://i.guim.co.uk/img/media/35d403182e4b262d37385281b19b763ee6b32f6a/58_0_1743_1046/master/1743.png?width=930&quality=45&auto=format&s=9ecd82413fef9883c1e7a0df2bf6abb1',
    });
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
          label="Banner design name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
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

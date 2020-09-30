import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  createStyles,
  IconButton,
  TextField,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
} from './helpers/validation';

const styles = createStyles({
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

type FormData = {
  name: string;
  nickname: string;
};

const NAME_DEFAULT_HELPER_TEXT = 'Date format: YYYY-MM-DD_TEST_NAME';
const NICKNAME_DEFAULT_HELPER_TEXT = "Pick a name for your test that's easy to recognise";

type Mode = 'NEW' | 'COPY';
interface CreateTestDialogProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  existingNicknames: string[];
  mode: Mode;
  createTest: (name: string, nickname: string) => void;
}

const CreateTestDialog: React.FC<CreateTestDialogProps> = ({
  classes,
  isOpen,
  close,
  existingNames,
  existingNicknames,
  mode,
  createTest,
}: CreateTestDialogProps) => {
  const defaultValues = {
    name: '',
    nickname: '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues,
  });

  const onSubmit = ({ name, nickname }: FormData): void => {
    createTest(name.toUpperCase(), nickname.toUpperCase());
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-test-dialog-title">
          {mode === 'NEW' ? 'Create a new test' : 'Name your new test'}
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
          label="Full test name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
        <TextField
          className={classes.input}
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: createDuplicateValidator(existingNicknames),
          })}
          error={errors.nickname !== undefined}
          helperText={errors.nickname ? errors.nickname.message : NICKNAME_DEFAULT_HELPER_TEXT}
          name="nickname"
          label="Nickname"
          margin="normal"
          variant="outlined"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          {mode === 'NEW' ? 'Create test' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(CreateTestDialog);

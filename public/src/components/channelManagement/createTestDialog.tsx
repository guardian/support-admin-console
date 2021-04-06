import React, { useState } from 'react';
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
  InputAdornment,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import {
  createDuplicateValidator,
  EMPTY_ERROR_HELPER_TEXT,
  INVALID_CHARACTERS_ERROR_HELPER_TEXT,
  VALID_CHARACTERS_REGEX,
} from './helpers/validation';
import { EpicTestKind } from './epicTests/epicTestsForm';

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
  testNamePrefix?: string;
  createTest: (name: string, nickname: string, kind: EpicTestKind) => void;
}

const CreateTestDialog: React.FC<CreateTestDialogProps> = ({
  classes,
  isOpen,
  close,
  existingNames,
  existingNicknames,
  mode,
  testNamePrefix,
  createTest,
}: CreateTestDialogProps) => {
  const defaultValues = {
    name: '',
    nickname: '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues,
  });
  const [kind, setKind] = useState<EpicTestKind>('COPY');

  const onSubmit = ({ name, nickname }: FormData): void => {
    createTest(`${testNamePrefix || ''}${name}`.toUpperCase(), nickname.toUpperCase(), kind);
    close();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setKind(event.target.value as EpicTestKind);
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
        <FormControl component="fieldset">
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup aria-label="type" name="type" value={kind} onChange={handleChange}>
            <FormControlLabel value="COPY" control={<Radio />} label="Copy" />
            <FormControlLabel value="DESIGN" control={<Radio />} label="Design" />
          </RadioGroup>
        </FormControl>

        <TextField
          className={classes.input}
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            pattern: {
              value: VALID_CHARACTERS_REGEX,
              message: INVALID_CHARACTERS_ERROR_HELPER_TEXT,
            },
            validate: createDuplicateValidator(existingNames, testNamePrefix),
          })}
          error={errors.name !== undefined}
          helperText={errors.name ? errors.name.message : NAME_DEFAULT_HELPER_TEXT}
          name="name"
          label="Full test name"
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{testNamePrefix || ''}</InputAdornment>
            ),
          }}
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

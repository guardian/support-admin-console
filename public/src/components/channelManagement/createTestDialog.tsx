import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  createStyles,
  IconButton,
  TextField,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import useValidatableField from "../../hooks/useValidatableField";

import {
  getInvalidCharactersError,
  getEmptyError,
  createGetDuplicateError,
} from "./helpers/validation";

const styles = ({}: Theme) =>
  createStyles({
    dialogHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingRight: "8px",
    },
  });

const NAME_DEFAULT_HELPER_TEXT = "Date format: YYYY-MM-DD_TEST_NAME";
const NICKNAME_DEFAULT_HELPER_TEXT =
  "Pick a name for your test that's easy to recognise";

type Mode = "NEW" | "COPY";

interface CreateTestDialogProps {
  isOpen: boolean;
  close: () => void;
  existingNames: string[];
  existingNicknames: string[];
  mode: Mode;
  copiedTestName?: string;
  copiedTestNickname?: string;
  createTest: (name: string, nickname: string) => void;
}

const CreateTestDialog = ({
  classes,
  isOpen,
  close,
  existingNames,
  existingNicknames,
  mode,
  copiedTestName,
  copiedTestNickname,
  createTest,
}: CreateTestDialogProps & WithStyles<typeof styles>) => {
  const getDuplicateNameError = createGetDuplicateError(existingNames);
  const getNameError = (value: string) =>
    getInvalidCharactersError(value) ||
    getEmptyError(value) ||
    getDuplicateNameError(value);

  const [
    name,
    setName,
    nameHasError,
    nameHelperText,
    checkName,
  ] = useValidatableField(NAME_DEFAULT_HELPER_TEXT, getNameError);

  useEffect(() => {
    if (mode === "COPY" && copiedTestName) {
      setName(`Copy of ${copiedTestName}`);
    }
  }, []);

  const getDuplicateNicknameError = createGetDuplicateError(existingNicknames);
  const getNicknameError = (value: string) =>
    getEmptyError(value) || getDuplicateNicknameError(value);

  const [
    nickname,
    setNickname,
    nicknameHasError,
    nicknameHelperText,
    checkNickname,
  ] = useValidatableField(NICKNAME_DEFAULT_HELPER_TEXT, getNicknameError);

  useEffect(() => {
    if (mode === "COPY" && copiedTestNickname) {
      setNickname(`Copy of ${copiedTestNickname}`);
    }
  }, []);

  const check = (): boolean => {
    const nameIsValid = checkName();
    const nicknameIsValid = checkNickname();

    return nameIsValid && nicknameIsValid;
  };

  const submit = () => {
    if (check()) {
      createTest(name, nickname);
      close();
    }
  };

  const updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const updateNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby="create-test-dialog-title"
    >
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-test-dialog-title">
          {mode === "NEW" ? "Create a new test" : "Name your new test"}
        </DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <TextField
          value={name}
          onChange={updateName}
          error={nameHasError}
          helperText={nameHelperText}
          label="Full test name"
          margin="normal"
          variant="outlined"
          autoFocus
          fullWidth
        />
        <TextField
          value={nickname}
          onChange={updateNickname}
          error={nicknameHasError}
          helperText={nicknameHelperText}
          label="Nickname"
          margin="normal"
          variant="outlined"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={submit} color="primary">
          {mode === "NEW" ? "Create test" : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(CreateTestDialog);

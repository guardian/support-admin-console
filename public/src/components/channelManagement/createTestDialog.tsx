import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  createStyles,
  IconButton,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import EditableTextField from "./editableTextField";

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
  const [name, setName] = useState("");
  const [nameIsValid, setNameIsValid] = useState(false);

  const getDuplicateNameError = createGetDuplicateError(existingNames);
  const getNameError = (value: string) =>
    getInvalidCharactersError(value) ||
    getEmptyError(value) ||
    getDuplicateNameError(value);
  const onNameValidationChange = (isValid: boolean) => setNameIsValid(isValid);
  const onNameSubmit = (updatedName: string) => setName(updatedName);

  useEffect(() => {
    if (mode === "COPY" && copiedTestName) {
      setName(`Copy of ${copiedTestName}`);
    }
  }, []);

  const [nickname, setNickname] = useState("");
  const [nicknameIsValid, setNicknameIsValid] = useState(false);

  const getDuplicateNicknameError = createGetDuplicateError(existingNicknames);
  const getNicknameError = (value: string) =>
    getEmptyError(value) || getDuplicateNicknameError(value);
  const onNicknameValidationChange = (isValid: boolean) =>
    setNicknameIsValid(isValid);
  const onNicknameSubmit = (updatedNickname: string) =>
    setNickname(updatedNickname);

  useEffect(() => {
    if (mode === "COPY" && copiedTestNickname) {
      setNickname(`Copy of ${copiedTestNickname}`);
    }
  }, []);

  const submit = () => {
    if (nameIsValid && nicknameIsValid) {
      createTest(name, nickname);
      close();
    }
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
        <EditableTextField
          text={name}
          onSubmit={onNameSubmit}
          helperText={NAME_DEFAULT_HELPER_TEXT}
          validation={{
            getError: getNameError,
            onChange: onNameValidationChange,
          }}
          label="Full test name"
          variant="outlined"
          editEnabled
          autoFocus
          required
          fullWidth
        />
        <EditableTextField
          text={nickname}
          onSubmit={onNicknameSubmit}
          helperText={NICKNAME_DEFAULT_HELPER_TEXT}
          validation={{
            getError: getNicknameError,
            onChange: onNicknameValidationChange,
          }}
          editEnabled
          label="Nickname"
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

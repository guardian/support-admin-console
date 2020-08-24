import React, { useState } from "react";
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
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

import useOpenable from "../../hooks/useOpenable";
import useValidatableField from "../../hooks/useValidatableField";

import {
  getInvalidCharactersError,
  getEmptyError,
  createGetDuplicateError,
} from "./helpers/validation";

const styles = ({}: Theme) =>
  createStyles({
    button: {
      borderStyle: "dashed",
      justifyContent: "start",
      height: "48px",
    },
    text: {
      fontSize: "12px",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
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

interface NewTestCreatorProps {
  existingNames: string[];
  existingNicknames: string[];
  createTest: (name: string, nickname: string) => void;
}

const NewTestCreator = ({
  classes,
  existingNames,
  existingNicknames,
  createTest,
}: NewTestCreatorProps & WithStyles<typeof styles>) => {
  const [isOpen, open, close] = useOpenable();

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
    <>
      <Button
        variant="outlined"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={open}
      >
        <Typography className={classes.text}>Create a new test</Typography>
      </Button>
      <Dialog open={isOpen} onClose={close} aria-labelledby="form-dialog-title">
        <div className={classes.dialogHeader}>
          <DialogTitle id="form-dialog-title">Create a new test</DialogTitle>
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
            Create test
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withStyles(styles)(NewTestCreator);

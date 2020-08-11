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

const NEW_NAME_DEFAULT_HELPER_TEXT = "Date format: YYYY-MM-DD_TEST_NAME";
const NEW_NICKNAME_DEFAULT_HELPER_TEXT =
  "Pick a name for your test that's easy to recognise";
const EMPTY_ERROR_HELPER_TEXT =
  "Field cannot be empty - please enter some text";
const DUPLICATE_ERROR_HELPER_TEXT = "Name already exists - please try another";
const INVALID_ERROR_HELPER_TEXT =
  "Only letters, numbers, underscores and hyphens are allowed";
const INVALID_CHARACTERS_REGEX = /[^\w-]/;

const useHelperTextAndError = (
  defaultHelperText: string
): [string, boolean, () => void, (helperText: string) => void] => {
  const [helperText, setHelperText] = useState(defaultHelperText);
  const [hasError, setHasError] = useState(false);

  const setDefaultHelperText = () => {
    setHelperText(defaultHelperText);
    setHasError(false);
  };

  const setErrorHelperText = (helperText: string) => {
    setHelperText(helperText);
    setHasError(true);
  };

  return [helperText, hasError, setDefaultHelperText, setErrorHelperText];
};

interface NewTestCreatorProps {
  existingNames: Array<string>;
  existingNicknames: Array<string>;
  createTest: (name: string, nickname: string) => void;
}

const NewTestCreator = ({
  classes,
  existingNames,
  existingNicknames,
  createTest,
}: NewTestCreatorProps & WithStyles<typeof styles>) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const [newName, setNewName] = useState("");
  const [
    newNameHelperText,
    newNameHasError,
    setNewNameDefaultHelperText,
    setNewNameErrorHelperText,
  ] = useHelperTextAndError(NEW_NAME_DEFAULT_HELPER_TEXT);

  const [newNickname, setNewNickname] = useState("");
  const [
    newNicknameHelperText,
    newNicknameHasError,
    setNewNicknameDefaultHelperText,
    setNewNicknameErrorHelperText,
  ] = useHelperTextAndError(NEW_NICKNAME_DEFAULT_HELPER_TEXT);

  const check = (isValid: boolean, onError: () => void) => {
    if (!isValid) {
      onError();
      return false;
    }
    return true;
  };

  const checkIsntEmpty = (text: string, onError: () => void): boolean => {
    return check(text !== "", onError);
  };

  const checkIsntAlreadyTaken = (
    text: string,
    existing: string[],
    onError: () => void
  ): boolean => {
    return check(!existing.includes(text), onError);
  };

  const checkDoesntContainInvalidCharacters = (
    text: string,
    onError: () => void
  ): boolean => {
    return check(!INVALID_CHARACTERS_REGEX.test(text), onError);
  };

  const checkNameValidity = (): boolean => {
    return (
      checkIsntEmpty(newName, () =>
        setNewNameErrorHelperText(EMPTY_ERROR_HELPER_TEXT)
      ) &&
      checkIsntAlreadyTaken(newName, existingNames, () =>
        setNewNameErrorHelperText(DUPLICATE_ERROR_HELPER_TEXT)
      ) &&
      checkDoesntContainInvalidCharacters(newName, () =>
        setNewNameErrorHelperText(INVALID_ERROR_HELPER_TEXT)
      )
    );
  };

  const checkNicknameValidity = (): boolean => {
    return (
      checkIsntEmpty(newNickname, () =>
        setNewNicknameErrorHelperText(EMPTY_ERROR_HELPER_TEXT)
      ) &&
      checkIsntAlreadyTaken(newNickname, existingNicknames, () =>
        setNewNicknameErrorHelperText(DUPLICATE_ERROR_HELPER_TEXT)
      )
    );
  };

  const checkValidity = (): boolean => {
    const nameIsValid = checkNameValidity();
    const nicknameIsValid = checkNicknameValidity();

    return nameIsValid && nicknameIsValid;
  };

  const submit = () => {
    if (checkValidity()) {
      createTest(newName, newNickname);
      closeDialog();
    }
  };

  const updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value.toUpperCase());
    setNewNameDefaultHelperText();
  };
  const updateNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(event.target.value.toUpperCase());
    setNewNicknameDefaultHelperText();
  };

  return (
    <>
      <Button
        variant="outlined"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={openDialog}
      >
        <Typography className={classes.text}>Create a new test</Typography>
      </Button>
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <div className={classes.dialogHeader}>
          <DialogTitle id="form-dialog-title">Create a new test</DialogTitle>
          <IconButton onClick={closeDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent dividers>
          <TextField
            value={newName}
            onChange={updateName}
            error={newNameHasError}
            helperText={newNameHelperText}
            label="Full test name"
            margin="normal"
            variant="outlined"
            autoFocus
            fullWidth
          />
          <TextField
            value={newNickname}
            onChange={updateNickname}
            error={newNicknameHasError}
            helperText={newNicknameHelperText}
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

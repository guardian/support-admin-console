import React, { useState } from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

import useOpenable from "../../../hooks/useOpenable";
import useValidatableField from "../../../hooks/useValidatableField";

import {
  getInvalidCharactersError,
  getEmptyError,
  createGetDuplicateError,
} from "../helpers/validation";

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    button: {
      width: "100%",
      display: "flex",
      justifyContent: "start",
      border: `1px dashed ${palette.grey[700]}`,
      borderRadius: "4px",
      padding: "12px 16px",
    },
    container: {
      display: "flex",
      alignItems: "center",
      "& > * + *": {
        marginLeft: spacing(1),
      },
    },
    text: {
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    dialogHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingRight: "8px",
    },
  });

const NAME_DEFAULT_HELPER_TEXT = "Format: 'control' or 'v1_name'";

interface BannerTestNewVariantButtonProps extends WithStyles<typeof styles> {
  existingNames: string[];
  createVariant: (name: string) => void;
  isDisabled: boolean;
}

const BannerTestNewVariantButton: React.FC<BannerTestNewVariantButtonProps> = ({
  classes,
  existingNames,
  createVariant,
  isDisabled,
}: BannerTestNewVariantButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  const getDuplicateError = createGetDuplicateError(existingNames);
  const getNameError = (value: string) =>
    getInvalidCharactersError(value) ||
    getEmptyError(value) ||
    getDuplicateError(value);

  const [name, setname, hasError, helperText, check] = useValidatableField(
    NAME_DEFAULT_HELPER_TEXT,
    getNameError
  );

  const updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setname(event.target.value);
  };

  const submit = () => {
    if (check()) {
      createVariant(name);
      close();
    }
  };

  return (
    <>
      <Button className={classes.button} onClick={open} disabled={isDisabled}>
        <div className={classes.container}>
          <AddIcon />
          <Typography className={classes.text}>New variant</Typography>
        </div>
      </Button>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby="new-variant-dialog-title"
        aria-describedby="new-variant-dialog-description"
        fullWidth
      >
        <div className={classes.dialogHeader}>
          <DialogTitle id="new-variant-dialog-title">
            Create a new variant
          </DialogTitle>
          <IconButton onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent dividers>
          <TextField
            label="Variant name"
            value={name}
            onChange={updateName}
            helperText={helperText}
            error={hasError}
            margin="normal"
            variant="outlined"
            autoFocus
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={submit} color="primary">
            Create variant
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withStyles(styles)(BannerTestNewVariantButton);

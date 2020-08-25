import React from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles,
  WithStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import useOpenable from "../../hooks/useOpenable";

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    copyAndArchiveContainer: {
      "& > * + *": {
        marginLeft: spacing(2),
      },
    },
    buttonText: {
      fontSize: "14px",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: palette.grey[800],
    },
  });

interface TestEditorActionButtonsProps extends WithStyles<typeof styles> {
  archive: () => void;
  isDisabled: boolean;
}

const TestEditorActionButtons: React.FC<TestEditorActionButtonsProps> = ({
  classes,
  archive,
  isDisabled,
}: TestEditorActionButtonsProps) => {
  const DeleteButton = () => {
    const [isOpen, open, close] = useOpenable();

    return (
      <>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon style={{ color: grey[700] }} />}
          size="medium"
          onClick={open}
          disabled={isDisabled}
        >
          <Typography className={classes.buttonText}>Delete test</Typography>
        </Button>
        <Dialog
          open={isOpen}
          onClose={close}
          aria-labelledby="delete-test-dialog-title"
          aria-describedby="delete-test-dialog-description"
        >
          <DialogTitle id="delete-test-dialog-title">Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-test-dialog-description">
              Deleting this test will remove it from the banner tool
              permanently.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary">Cancel</Button>
            <Button color="primary" autoFocus>
              Delete test
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const ArchiveButton = () => {
    const [isOpen, open, close] = useOpenable();

    return (
      <>
        <Button
          variant="outlined"
          startIcon={<ArchiveIcon style={{ color: grey[700] }} />}
          size="medium"
          onClick={open}
          disabled={isDisabled}
        >
          <Typography className={classes.buttonText}>Archive test</Typography>
        </Button>
        <Dialog
          open={isOpen}
          onClose={close}
          aria-labelledby="archive-test-dialog-title"
          aria-describedby="archive-test-dialog-description"
        >
          <DialogTitle id="archive-test-dialog-title">
            Are you sure?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="archive-test-dialog-description">
              Archiving this test will remove it from the banner tool - you can
              only restore it with an engineer's help.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={close}>
              Cancel
            </Button>
            <Button color="primary" onClick={archive}>
              Archive test
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const CopyButton = () => {
    return (
      <Button
        variant="outlined"
        startIcon={<FileCopyIcon style={{ color: grey[700] }} />}
        size="medium"
        disabled={isDisabled}
      >
        <Typography className={classes.buttonText}>Copy test</Typography>
      </Button>
    );
  };
  return (
    <div className={classes.container}>
      <div className={classes.copyAndArchiveContainer}>
        <CopyButton />
        <ArchiveButton />
      </div>
      <DeleteButton />
    </div>
  );
};

export default withStyles(styles)(TestEditorActionButtons);

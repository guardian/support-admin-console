import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ArchiveIcon from '@material-ui/icons/Archive';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(({ palette }: Theme) => ({
  buttonText: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: palette.grey[800],
  },
}));

interface TestArchiveButtonProps {
  onTestArchive: () => void;
}

export const TestArchiveButton: React.FC<TestArchiveButtonProps> = ({
  onTestArchive,
}: TestArchiveButtonProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ArchiveIcon style={{ color: grey[700] }} />}
        size="medium"
        onClick={open}
      >
        {/* eslint-disable-next-line react/prop-types */}
        <Typography className={classes.buttonText}>Archive test</Typography>
      </Button>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby="archive-test-dialog-title"
        aria-describedby="archive-test-dialog-description"
      >
        <DialogTitle id="archive-test-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="archive-test-dialog-description">
            Archiving this test will remove it from the banner tool - you can only restore it with
            an engineer&apos;s help.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={close}>
            Cancel
          </Button>
          <Button color="primary" onClick={onTestArchive}>
            Archive test
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

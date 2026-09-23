import ArchiveIcon from '@mui/icons-material/Archive';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';

const ButtonText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: theme.palette.grey[800],
}));

interface TestArchiveButtonProps {
  onTestArchive: () => void;
}

export const TestArchiveButton: React.FC<TestArchiveButtonProps> = ({
  onTestArchive,
}: TestArchiveButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ArchiveIcon style={{ color: grey[700] }} />}
        size="medium"
        onClick={open}
      >
        <ButtonText>Archive test</ButtonText>
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
            Archiving this test will remove it from the RRCP - you can only restore it with an
            engineer&apos;s help.
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

import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Theme,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { grey } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CreateTestDialog from '../createTestDialog';
import useOpenable from '../../../../../hooks/useOpenable';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyAndArchiveContainer: {
    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
  buttonText: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: palette.grey[800],
  },
}));

interface TestEditorActionButtonsProps {
  existingNames: string[];
  sourceName?: string | void;
  existingNicknames: string[];
  sourceNickname?: string | void;
  testNamePrefix?: string;
  onArchive: () => void;
  onDelete: () => void;
  isDisabled: boolean;
  onCopy: (name: string, nickname: string) => void;
}

const TestEditorActionButtons: React.FC<TestEditorActionButtonsProps> = ({
  existingNames,
  sourceName,
  existingNicknames,
  sourceNickname,
  testNamePrefix,
  onArchive,
  onDelete,
  isDisabled,
  onCopy,
}: TestEditorActionButtonsProps) => {
  const classes = useStyles();

  const DeleteButton: React.FC = () => {
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
          {/* eslint-disable-next-line react/prop-types */}
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
              Deleting this test will remove it from the banner tool permanently.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={close}>
              Cancel
            </Button>
            <Button color="primary" onClick={onDelete}>
              Delete test
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const ArchiveButton: React.FC = () => {
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
            <Button color="primary" onClick={onArchive}>
              Archive test
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const CopyButton: React.FC = () => {
    const [isOpen, open, close] = useOpenable();
    return (
      <>
        <Button
          onClick={open}
          variant="outlined"
          startIcon={<FileCopyIcon style={{ color: grey[700] }} />}
          size="medium"
          disabled={isDisabled}
        >
          {/* eslint-disable-next-line react/prop-types */}
          <Typography className={classes.buttonText}>Copy test</Typography>
        </Button>
        <CreateTestDialog
          isOpen={isOpen}
          close={close}
          existingNames={existingNames}
          sourceName={sourceName}
          existingNicknames={existingNicknames}
          sourceNickname={sourceNickname}
          testNamePrefix={testNamePrefix}
          mode="COPY"
          createTest={onCopy}
        />
      </>
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

export default TestEditorActionButtons;

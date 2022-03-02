import React from 'react';
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
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import DeleteIcon from '@material-ui/icons/Delete';
import ArchiveIcon from '@material-ui/icons/Archive';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CreateTestDialog from './createTestDialog';
import useOpenable from '../../hooks/useOpenable';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
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
  });

interface TestEditorActionButtonsProps extends WithStyles<typeof styles> {
  existingNames: string[];
  existingNicknames: string[];
  testNamePrefix?: string;
  onArchive: () => void;
  onDelete: () => void;
  isDisabled: boolean;
  onCopy: (name: string, nickname: string) => void;
}

const TestEditorActionButtons: React.FC<TestEditorActionButtonsProps> = ({
  classes,
  existingNames,
  existingNicknames,
  testNamePrefix,
  onArchive,
  onDelete,
  isDisabled,
  onCopy,
}: TestEditorActionButtonsProps) => {
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
          existingNicknames={existingNicknames}
          testNamePrefix={testNamePrefix}
          campaigns={[{ name: 'C1' }, { name: 'C2' }]}
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

export default withStyles(styles)(TestEditorActionButtons);

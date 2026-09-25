// This component is not used anywhere in the current codebase. Should it be deleted?
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
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
import useOpenable from '../../hooks/useOpenable';
import CreateTestDialog from './createTestDialog';

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const CopyAndArchiveContainer = styled('div')(({ theme }) => ({
  '& > * + *': {
    marginLeft: theme.spacing(2),
  },
}));
const ButtonText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: theme.palette.grey[800],
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

interface DeleteButtonProps {
  isDisabled: boolean;
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ isDisabled, onDelete }) => {
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
        <ButtonText>Delete test</ButtonText>
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
            Deleting this test will remove it from the RRCP permanently.
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

interface ArchiveButtonProps {
  isDisabled: boolean;
  onArchive: () => void;
}

const ArchiveButton: React.FC<ArchiveButtonProps> = ({ isDisabled, onArchive }) => {
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
          <Button color="primary" onClick={onArchive}>
            Archive test
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface CopyButtonProps {
  isDisabled: boolean;
  existingNames: string[];
  sourceName?: string | void;
  existingNicknames: string[];
  sourceNickname?: string | void;
  testNamePrefix?: string;
  onCopy: (name: string, nickname: string) => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  isDisabled,
  existingNames,
  sourceName,
  existingNicknames,
  sourceNickname,
  testNamePrefix,
  onCopy,
}) => {
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
        <ButtonText>Copy test</ButtonText>
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
  return (
    <Container>
      <CopyAndArchiveContainer>
        <CopyButton
          isDisabled={isDisabled}
          existingNames={existingNames}
          sourceName={sourceName}
          existingNicknames={existingNicknames}
          sourceNickname={sourceNickname}
          testNamePrefix={testNamePrefix}
          onCopy={onCopy}
        />
        <ArchiveButton isDisabled={isDisabled} onArchive={onArchive} />
      </CopyAndArchiveContainer>
      <DeleteButton isDisabled={isDisabled} onDelete={onDelete} />
    </Container>
  );
};

export default TestEditorActionButtons;

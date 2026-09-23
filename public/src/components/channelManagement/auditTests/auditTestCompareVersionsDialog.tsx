import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { IChange, Operation } from 'json-diff-ts';
import * as React from 'react';

const StyledDialog = styled(Dialog)({
  padding: '10px',
});

const listStyleBase = {
  maxWidth: '1000px',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
} as const;

const ListStyleAdd = styled('p')({ ...listStyleBase, color: 'green' });
const ListStyleRemove = styled('p')({ ...listStyleBase, color: 'red' });

const ListItem = ({ diff }: { diff: IChange }) => {
  if (diff.type === Operation.ADD) {
    if (typeof diff.value === 'string') {
      return (
        <li>
          <p style={{ color: 'green' }}> Added : {diff.value}</p>
        </li>
      );
    }
    return (
      <li>
        <ListStyleAdd> Added :{diff.key}</ListStyleAdd>
        <pre>
          <ListStyleAdd> Added : {JSON.stringify(diff.value)}</ListStyleAdd>
        </pre>
      </li>
    );
  }
  if (diff.type === Operation.REMOVE) {
    if (typeof diff.value === 'string') {
      return (
        <li>
          <p style={{ color: 'red' }}> Removed : {diff.value}</p>
        </li>
      );
    }
    return (
      <li>
        <ListStyleRemove> Removed : {diff.key}</ListStyleRemove>
        <pre>
          <ListStyleRemove> Removed : {JSON.stringify(diff.value)}</ListStyleRemove>
        </pre>
      </li>
    );
  }
  return (
    <li>
      <p>{diff.key}</p>
      {diff.oldValue && (
        <div>
          <p style={{ color: 'red' }}>Old Value : {diff.oldValue}</p>
        </div>
      )}
      {diff.value && (
        <div>
          <p style={{ color: 'green' }}>New Value : {diff.value}</p>
        </div>
      )}

      {diff.changes && <List diffs={diff.changes} />}
    </li>
  );
};
// Recursively render the diff changes
const List = ({ diffs }: { diffs: IChange[] }) => {
  return (
    <ul>
      {diffs.map((diff) => (
        <ListItem key={diff.key} diff={diff} />
      ))}
    </ul>
  );
};

interface AuditTestCompareVersionsDialogProps {
  jsonDiff: IChange[];
  open: boolean;
  setOpen: (open: boolean) => void;
  versionToCompare: number; //to display which version is being compared
}

export const AuditTestCompareVersionsDialog: React.FC<AuditTestCompareVersionsDialogProps> = ({
  jsonDiff,
  open,
  setOpen,
  versionToCompare,
}: AuditTestCompareVersionsDialogProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <h4>
          Version changes between Version {versionToCompare} and Version {versionToCompare - 1}
        </h4>
        <div>
          <List diffs={jsonDiff} />
        </div>
      </StyledDialog>
    </>
  );
};

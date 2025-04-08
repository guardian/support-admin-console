import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { IChange } from 'json-diff-ts';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(({}: Theme) => ({
  dialog: {
    padding: '10px',
  },
  listStyleAdd: {
    color: 'green',
    maxWidth: '1000px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  listStyleRemove: {
    color: 'red',
    maxWidth: '1000px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
}));

const ListItem = ({ diff }: { diff: IChange }) => {
  const classes = useStyles();
  if (diff.type === 'ADD') {
    if (typeof diff.value === 'string') {
      return (
        <li>
          <p style={{ color: 'green' }}> Added : {diff.value}</p>
        </li>
      );
    }
    return (
      <li>
        <p className={classes.listStyleAdd}> Added :{diff.key}</p>
        <pre>
          <p className={classes.listStyleAdd}> Added : {JSON.stringify(diff.value)}</p>
        </pre>
      </li>
    );
  }
  if (diff.type === 'REMOVE') {
    const classes = useStyles();
    if (typeof diff.value === 'string') {
      return (
        <li>
          <p style={{ color: 'red' }}> Removed : {diff.value}</p>
        </li>
      );
    }
    return (
      <li>
        <p className={classes.listStyleRemove}> Removed : {diff.key}</p>
        <pre>
          <p className={classes.listStyleRemove}> Removed : {JSON.stringify(diff.value)}</p>
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
      {diffs.map(diff => (
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
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" className={classes.dialog}>
        <h4>
          Version changes between Version {versionToCompare} and Version {versionToCompare - 1}
        </h4>
        <div>
          <List diffs={jsonDiff} />
        </div>
      </Dialog>
    </>
  );
};

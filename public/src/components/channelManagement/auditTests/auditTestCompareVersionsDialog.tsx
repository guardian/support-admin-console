import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { IChange } from 'json-diff-ts';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const ListItem = ({ diff }: { diff: IChange }) => {
  if (diff.type === 'ADD') {
    return (
      <li>
        <p style={{ color: 'green' }}>Added : {diff.value}</p>
      </li>
    );
  }
  if (diff.type === 'REMOVE') {
    return (
      <li>
        <p style={{ color: 'red' }}>Removed: {diff.value}</p>
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

const List = ({ diffs }: { diffs: IChange[] }) => {
  return (
    <ul>
      {diffs.map(diff => (
        <ListItem key={diff.key} diff={diff} />
      ))}
    </ul>
  );
};

const useStyles = makeStyles(({}: Theme) => ({
  dialog: {
    padding: '10px',
  },
  button: {
    height: '100%',
  },
  heading: {
    margin: '6px 12px 0 12px',
    fontSize: 18,
    fontWeight: 500,
  },
  chartContainer: {
    margin: '12px',
  },
}));
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

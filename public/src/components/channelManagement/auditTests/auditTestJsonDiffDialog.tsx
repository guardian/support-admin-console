import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { IChange } from 'json-diff-ts';
import { makeStyles } from '@mui/styles';
import { Theme, Typography } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { AuditDisplayTable } from './auditDisplayTable';
import { isUndefined } from 'lodash';

const getData = (row: IChange) => {
  const nestedChangeData = isUndefined(row.changes)
    ? ''
    : JSON.stringify(row.changes.map(r => r.changes));

  const furtherNestedChangeData = isUndefined(row.changes?.map(r => r.changes))
    ? ''
    : JSON.stringify(row.changes?.map(r => r.changes?.map(e => e.changes)));

  return (
    <TableRow key={row.key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        {row.key}
      </TableCell>
      <TableCell align="right">{row.type.toString()}</TableCell>
      {/*<TableCell align="right">{row.value?.toString() ?? ''}</TableCell>*/}
      {/*<TableCell align="right">{row.oldValue?.toString() ?? ''}</TableCell>*/}
      <TableCell align="right">{JSON.stringify(row.changes)}</TableCell>
      <TableCell align="right">{nestedChangeData}</TableCell>
      <TableCell align="right">{furtherNestedChangeData}</TableCell>
    </TableRow>
  );
};

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
interface AuditTestJsonDiffDialogProps {
  jsonDiff: IChange[];
  open: boolean;
}
export const AuditTestJsonDiffDialog: React.FC<AuditTestJsonDiffDialogProps> = ({
  jsonDiff,
  open,
}: AuditTestJsonDiffDialogProps) => {
  const classes = useStyles();

  const data = jsonDiff;
  const changes = jsonDiff.map(change => change.changes);
  console.log('Changes', changes);
  console.log('Data', data);

  const finalData = jsonDiff.map(row => getData(row));
  console.log('FinalData', finalData);
  return (
    <>
      <Dialog open={open} fullWidth maxWidth="lg" className={classes.dialog}>
        <Typography>Version changes</Typography>
        <div>
          <List diffs={jsonDiff} />
        </div>
      </Dialog>
    </>
  );
};

import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { FlattenedChange, formatChangeValue, VersionDiff } from '../../utils/defaultChoiceCards';
import { useStyles } from './styles';

interface VersionDiffTableProps {
  version: string;
  diff: VersionDiff;
}

export const VersionDiffTable: React.FC<VersionDiffTableProps> = ({ version, diff }) => {
  const classes = useStyles();

  if (diff.changes.length === 0) {
    return (
      <Typography variant="body2" className={classes.diffEmptyState}>
        No differences.
      </Typography>
    );
  }

  const changes: FlattenedChange[] = diff.changes;

  return (
    <Table size="small" className={classes.diffTable} aria-label={`Differences for ${version}`}>
      <TableHead>
        <TableRow>
          <TableCell className={`${classes.diffFieldCell} ${classes.diffHeaderCell}`}>
            Changed field
          </TableCell>
          <TableCell className={`${classes.diffValueCell} ${classes.diffHeaderCell}`}>
            Previous version ({diff.previousVersionId})
          </TableCell>
          <TableCell className={`${classes.diffValueCell} ${classes.diffHeaderCell}`}>
            Current version ({version})
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {changes.map((change) => (
          <TableRow key={`${change.type}-${change.path}`}>
            <TableCell className={classes.diffFieldCell}>{change.path}</TableCell>
            <TableCell className={classes.diffValueCell}>
              {change.type === 'add' ? '-' : formatChangeValue(change.oldValue)}
            </TableCell>
            <TableCell className={classes.diffValueCell}>
              {change.type === 'remove' ? '-' : formatChangeValue(change.value)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

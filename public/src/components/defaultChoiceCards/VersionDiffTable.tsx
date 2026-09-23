import { TableBody, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { FlattenedChange, formatChangeValue, VersionDiff } from '../../utils/defaultChoiceCards';
import {
  DiffEmptyState,
  DiffFieldCell,
  DiffFieldHeaderCell,
  DiffHeaderCell,
  DiffTable,
  DiffValueCell,
} from './styles';

interface VersionDiffTableProps {
  version: string;
  diff: VersionDiff;
}

export const VersionDiffTable: React.FC<VersionDiffTableProps> = ({ version, diff }) => {
  if (diff.changes.length === 0) {
    return <DiffEmptyState variant="body2">No differences.</DiffEmptyState>;
  }

  const changes: FlattenedChange[] = diff.changes;

  return (
    <DiffTable size="small" aria-label={`Differences for ${version}`}>
      <TableHead>
        <TableRow>
          <DiffFieldHeaderCell>Changed field</DiffFieldHeaderCell>
          <DiffHeaderCell>Previous version ({diff.previousVersionId})</DiffHeaderCell>
          <DiffHeaderCell>Current version ({version})</DiffHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {changes.map((change) => (
          <TableRow key={`${change.type}-${change.path}`}>
            <DiffFieldCell>{change.path}</DiffFieldCell>
            <DiffValueCell>
              {change.type === 'add' ? '-' : formatChangeValue(change.oldValue)}
            </DiffValueCell>
            <DiffValueCell>
              {change.type === 'remove' ? '-' : formatChangeValue(change.value)}
            </DiffValueCell>
          </TableRow>
        ))}
      </TableBody>
    </DiffTable>
  );
};

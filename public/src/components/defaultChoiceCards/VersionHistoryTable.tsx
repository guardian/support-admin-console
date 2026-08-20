import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { VersionDiff } from '../../utils/defaultChoiceCards';
import { VersionHistoryItem } from './useVersionHistory';
import { VersionHistoryRow } from './VersionHistoryRow';

interface VersionHistoryTableProps {
  versions: VersionHistoryItem[];
  diffs: Record<string, VersionDiff | null>;
  diffLoading: string | null;
  visibleDiffVersions: Set<string>;
  onToggleDifferences: (versionId: string) => Promise<void>;
}

export const VersionHistoryTable: React.FC<VersionHistoryTableProps> = ({
  versions,
  diffs,
  diffLoading,
  visibleDiffVersions,
  onToggleDifferences,
}) => (
  <TableContainer component={Paper}>
    <Table size="small" aria-label="Default choice cards version history">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Version</TableCell>
          <TableCell>Modified by</TableCell>
          <TableCell align="right">Differences</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {versions.map((item) => (
          <VersionHistoryRow
            key={item.version}
            item={item}
            diff={
              Object.prototype.hasOwnProperty.call(diffs, item.version)
                ? diffs[item.version]
                : undefined
            }
            isDiffVisible={visibleDiffVersions.has(item.version)}
            isDiffLoading={diffLoading === item.version}
            onToggleDifferences={onToggleDifferences}
          />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

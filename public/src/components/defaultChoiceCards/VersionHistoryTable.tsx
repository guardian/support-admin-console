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
import { DefaultChoiceCardsVersionHistoryItem } from '../../models/defaultChoiceCards';
import { VersionDiff } from '../../utils/defaultChoiceCards';
import { VersionHistoryRow } from './VersionHistoryRow';

interface VersionHistoryTableProps {
  versions: DefaultChoiceCardsVersionHistoryItem[];
  diffs: Record<string, VersionDiff | null>;
  loadingDiffs: Set<string>;
  visibleDiffVersions: Set<string>;
  onToggleDifferences: (versionId: string) => Promise<void>;
}

export const VersionHistoryTable: React.FC<VersionHistoryTableProps> = ({
  versions,
  diffs,
  loadingDiffs,
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
            isDiffLoading={loadingDiffs.has(item.version)}
            isAnyDiffLoading={loadingDiffs.size > 0}
            onToggleDifferences={onToggleDifferences}
          />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

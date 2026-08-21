import { Button, CircularProgress, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import { DefaultChoiceCardsVersionHistoryItem } from '../../models/defaultChoiceCards';
import { VersionDiff } from '../../utils/defaultChoiceCards';
import { useStyles } from './styles';
import { VersionDiffTable } from './VersionDiffTable';

interface VersionHistoryRowProps {
  item: DefaultChoiceCardsVersionHistoryItem;
  diff?: VersionDiff | null;
  isDiffVisible: boolean;
  loadingDiff: string | null;
  onToggleDifferences: (versionId: string) => Promise<void>;
}

export const VersionHistoryRow: React.FC<VersionHistoryRowProps> = ({
  item,
  diff,
  isDiffVisible,
  loadingDiff,
  onToggleDifferences,
}) => {
  const classes = useStyles();
  const hasDiff = diff !== undefined;
  const isDiffLoading = loadingDiff === item.version;

  return (
    <>
      <TableRow>
        <TableCell>{new Date(item.lastModified).toLocaleString()}</TableCell>
        <TableCell>
          {item.version}
          {item.isLatest ? ' (current)' : ''}
        </TableCell>
        <TableCell>{item.lastEditedBy ?? 'Unknown'}</TableCell>
        <TableCell align="right">
          <Button
            variant="outlined"
            size="small"
            disabled={loadingDiff !== null}
            onClick={() => void onToggleDifferences(item.version)}
            startIcon={isDiffLoading ? <CircularProgress size={14} /> : undefined}
          >
            {isDiffLoading ? '' : isDiffVisible ? 'Hide differences' : 'Show differences'}
          </Button>
        </TableCell>
      </TableRow>
      {isDiffVisible && hasDiff && (
        <TableRow>
          <TableCell colSpan={4} className={classes.diffCell}>
            {diff === null ? (
              <Typography variant="body2">
                No earlier version is available to compare against.
              </Typography>
            ) : (
              <VersionDiffTable version={item.version} diff={diff} />
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

import HistoryIcon from '@mui/icons-material/History';
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { FlattenedChange, formatChangeValue } from '../../utils/defaultChoiceCards';
import { useStyles } from './styles';
import { useVersionHistory } from './useVersionHistory';

export const VersionHistory: React.FC = () => {
  const classes = useStyles();
  const {
    versions,
    loading,
    error,
    diffs,
    diffLoading,
    visibleDiffVersions,
    loadVersions,
    toggleDifferences,
  } = useVersionHistory();

  return (
    <div className={classes.versionHistory}>
      <Button
        onClick={() => void loadVersions()}
        disabled={loading}
        variant="outlined"
        startIcon={loading ? <CircularProgress size={16} /> : <HistoryIcon />}
      >
        {versions ? 'Refresh version history' : 'Show version history'}
      </Button>
      {error && <Alert severity="error">Unable to load version history: {error}</Alert>}
      {versions && !error && (
        <div className={classes.versionHistoryContent}>
          <Typography variant="h6">Version history</Typography>
          {versions.length === 0 ? (
            <Typography variant="body2">No previous versions are available.</Typography>
          ) : (
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
                  {versions.map((item) => {
                    const itemDiff = diffs[item.version];
                    const hasDiff = Object.prototype.hasOwnProperty.call(diffs, item.version);
                    const hasNoPreviousVersion = hasDiff && itemDiff === null;
                    const flattenedDiff: FlattenedChange[] =
                      hasDiff && itemDiff ? itemDiff.changes : [];
                    const isDiffVisible = visibleDiffVersions.has(item.version);

                    return (
                      <React.Fragment key={item.version}>
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
                              disabled={diffLoading === item.version}
                              onClick={() => void toggleDifferences(item.version)}
                              startIcon={
                                diffLoading === item.version ? (
                                  <CircularProgress size={14} />
                                ) : undefined
                              }
                            >
                              {diffLoading === item.version
                                ? ''
                                : isDiffVisible
                                  ? 'Hide differences'
                                  : 'Show differences'}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {isDiffVisible && hasDiff && (
                          <TableRow>
                            <TableCell colSpan={4} className={classes.diffCell}>
                              {hasNoPreviousVersion ? (
                                <Typography variant="body2">
                                  No earlier version is available to compare against.
                                </Typography>
                              ) : flattenedDiff.length === 0 ? (
                                <Typography variant="body2">No differences.</Typography>
                              ) : (
                                <Table
                                  size="small"
                                  className={classes.diffTable}
                                  aria-label={`Differences for ${item.version}`}
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell className={classes.diffFieldCell}>
                                        Changed field
                                      </TableCell>
                                      <TableCell className={classes.diffValueCell}>
                                        Previous version ({itemDiff?.previousVersionId})
                                      </TableCell>
                                      <TableCell className={classes.diffValueCell}>
                                        Current version ({item.version})
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {flattenedDiff.map((change) => (
                                      <TableRow key={`${change.type}-${change.path}`}>
                                        <TableCell className={classes.diffFieldCell}>
                                          {change.path}
                                        </TableCell>
                                        <TableCell className={classes.diffValueCell}>
                                          {change.type === 'add'
                                            ? '-'
                                            : formatChangeValue(change.oldValue)}
                                        </TableCell>
                                        <TableCell className={classes.diffValueCell}>
                                          {change.type === 'remove'
                                            ? '-'
                                            : formatChangeValue(change.value)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}
    </div>
  );
};

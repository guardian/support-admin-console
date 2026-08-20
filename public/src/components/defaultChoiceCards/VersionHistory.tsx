import HistoryIcon from '@mui/icons-material/History';
import { Alert, Button, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { useStyles } from './styles';
import { useVersionHistory } from './useVersionHistory';
import { VersionHistoryTable } from './VersionHistoryTable';

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
            <VersionHistoryTable
              versions={versions}
              diffs={diffs}
              diffLoading={diffLoading}
              visibleDiffVersions={visibleDiffVersions}
              onToggleDifferences={toggleDifferences}
            />
          )}
        </div>
      )}
    </div>
  );
};

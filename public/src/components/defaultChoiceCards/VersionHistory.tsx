import HistoryIcon from '@mui/icons-material/History';
import { Alert, Button, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { VersionHistory as VersionHistoryContainer, VersionHistoryContent } from './styles';
import { useVersionHistory } from './useVersionHistory';
import { VersionHistoryTable } from './VersionHistoryTable';

export const VersionHistory: React.FC = () => {
  const {
    versions,
    loading,
    error,
    diffs,
    loadingDiff,
    visibleDiffVersions,
    loadVersions,
    toggleDifferences,
  } = useVersionHistory();

  return (
    <VersionHistoryContainer>
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
        <VersionHistoryContent>
          <Typography variant="h6">Version history</Typography>
          {versions.length === 0 ? (
            <Typography variant="body2">No previous versions are available.</Typography>
          ) : (
            <VersionHistoryTable
              versions={versions}
              diffs={diffs}
              loadingDiff={loadingDiff}
              visibleDiffVersions={visibleDiffVersions}
              onToggleDifferences={toggleDifferences}
            />
          )}
        </VersionHistoryContent>
      )}
    </VersionHistoryContainer>
  );
};

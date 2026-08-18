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
import { fetchFrontendSettingVersions, FrontendSettingsType } from '../../utils/requests';
import { useStyles } from './styles';

interface VersionHistoryItem {
  version: string;
  lastModified: string;
  isLatest: boolean;
  lastEditedBy?: string;
}

export const VersionHistory: React.FC = () => {
  const classes = useStyles();
  const [versions, setVersions] = React.useState<VersionHistoryItem[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadVersions = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const fetchedVersions = await fetchFrontendSettingVersions<VersionHistoryItem[]>(
        FrontendSettingsType.DefaultChoiceCards,
      );
      setVersions(fetchedVersions);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

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
                  {versions.map((item) => (
                    <TableRow key={item.version}>
                      <TableCell>{new Date(item.lastModified).toLocaleString()}</TableCell>
                      <TableCell>
                        {item.version}
                        {item.isLatest ? ' (current)' : ''}
                      </TableCell>
                      <TableCell>{item.lastEditedBy ?? 'Unknown'}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small">
                          Show differences
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}
    </div>
  );
};

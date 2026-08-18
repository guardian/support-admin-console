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
import { DefaultChoiceCardsSettings } from '../../models/defaultChoiceCards';
import {
  fetchFrontendSettingVersion,
  fetchFrontendSettingVersions,
  FrontendSettingsType,
} from '../../utils/requests';
import { useStyles } from './styles';
import { FlattenedChange, formatChangeValue, getChanges, VersionDiff } from './utils';

interface VersionHistoryItem {
  version: string;
  lastModified: string;
  isLatest: boolean;
  lastEditedBy?: string;
}

interface VersionedSettings {
  value: DefaultChoiceCardsSettings;
  version: string;
}

export const VersionHistory: React.FC = () => {
  const classes = useStyles();
  const [versions, setVersions] = React.useState<VersionHistoryItem[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [diffs, setDiffs] = React.useState<Record<string, VersionDiff | null>>({});
  const [diffLoading, setDiffLoading] = React.useState<string | null>(null);
  const [visibleDiffVersions, setVisibleDiffVersions] = React.useState<Set<string>>(new Set());

  // Versions are compared against the one immediately before them chronologically.
  const sortedVersions = versions
    ? [...versions].sort(
        (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
      )
    : [];

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

  const fetchDifferences = async (versionId: string): Promise<void> => {
    const versionIndex = sortedVersions.findIndex((item) => item.version === versionId);
    const previousVersionIndex = versionIndex + 1;
    const hasPreviousVersion = versionIndex !== -1 && previousVersionIndex < sortedVersions.length;

    if (!hasPreviousVersion) {
      setDiffs((currentDiffs) => ({ ...currentDiffs, [versionId]: null }));
      return;
    }

    const previousVersion = sortedVersions[previousVersionIndex];
    setDiffLoading(versionId);
    setError(null);
    try {
      const [previousSettings, selectedSettings] = await Promise.all([
        fetchFrontendSettingVersion<VersionedSettings>(
          FrontendSettingsType.DefaultChoiceCards,
          previousVersion.version,
        ),
        fetchFrontendSettingVersion<VersionedSettings>(
          FrontendSettingsType.DefaultChoiceCards,
          versionId,
        ),
      ]);
      setDiffs((currentDiffs) => ({
        ...currentDiffs,
        [versionId]: {
          previousVersionId: previousVersion.version,
          changes: getChanges(previousSettings.value, selectedSettings.value),
        },
      }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unknown error');
    } finally {
      setDiffLoading(null);
    }
  };

  const toggleDifferences = async (versionId: string): Promise<void> => {
    if (visibleDiffVersions.has(versionId)) {
      setVisibleDiffVersions((current) => {
        const next = new Set(current);
        next.delete(versionId);
        return next;
      });
      return;
    }

    setVisibleDiffVersions((current) => new Set(current).add(versionId));

    const isAlreadyFetched = Object.prototype.hasOwnProperty.call(diffs, versionId);
    if (!isAlreadyFetched) {
      await fetchDifferences(versionId);
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

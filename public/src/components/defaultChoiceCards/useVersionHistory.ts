import React from 'react';
import {
  DefaultChoiceCardsVersionHistoryItem,
  VersionedDefaultChoiceCardsSettings,
} from '../../models/defaultChoiceCards';
import { getChanges, VersionDiff } from '../../utils/defaultChoiceCards';
import {
  fetchFrontendSettingVersion,
  fetchFrontendSettingVersions,
  FrontendSettingsType,
} from '../../utils/requests';

interface UseVersionHistoryResult {
  versions: VersionHistoryItem[] | null;
  loading: boolean;
  error: string | null;
  diffs: Record<string, VersionDiff | null>;
  loadingDiffs: Set<string>;
  visibleDiffVersions: Set<string>;
  loadVersions: () => Promise<void>;
  toggleDifferences: (versionId: string) => Promise<void>;
}

export type VersionHistoryItem = DefaultChoiceCardsVersionHistoryItem;

export const useVersionHistory = (): UseVersionHistoryResult => {
  const [versions, setVersions] = React.useState<VersionHistoryItem[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [diffs, setDiffs] = React.useState<Record<string, VersionDiff | null>>({});
  const [loadingDiffs, setLoadingDiffs] = React.useState<Set<string>>(new Set());
  const [visibleDiffVersions, setVisibleDiffVersions] = React.useState<Set<string>>(new Set());

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
      setDiffs({});
      setLoadingDiffs(new Set());
      setVisibleDiffVersions(new Set());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDifferences = async (versionId: string): Promise<boolean> => {
    const versionIndex = sortedVersions.findIndex((item) => item.version === versionId);
    const previousVersionIndex = versionIndex + 1;
    const hasPreviousVersion = versionIndex !== -1 && previousVersionIndex < sortedVersions.length;

    if (!hasPreviousVersion) {
      setDiffs((currentDiffs) => ({ ...currentDiffs, [versionId]: null }));
      return true;
    }

    const previousVersion = sortedVersions[previousVersionIndex];
    setLoadingDiffs((current) => new Set(current).add(versionId));
    setError(null);
    try {
      const [previousSettings, selectedSettings] = await Promise.all([
        fetchFrontendSettingVersion<VersionedDefaultChoiceCardsSettings>(
          FrontendSettingsType.DefaultChoiceCards,
          previousVersion.version,
        ),
        fetchFrontendSettingVersion<VersionedDefaultChoiceCardsSettings>(
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
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unknown error');
      return false;
    } finally {
      setLoadingDiffs((current) => {
        const next = new Set(current);
        next.delete(versionId);
        return next;
      });
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

    const isAlreadyFetched = Object.prototype.hasOwnProperty.call(diffs, versionId);
    if (!isAlreadyFetched) {
      const fetched = await fetchDifferences(versionId);
      if (!fetched) {
        return;
      }
    }

    setVisibleDiffVersions((current) => new Set(current).add(versionId));
  };

  return {
    versions,
    loading,
    error,
    diffs,
    loadingDiffs,
    visibleDiffVersions,
    loadVersions,
    toggleDifferences,
  };
};

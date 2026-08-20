import React from 'react';
import { DefaultChoiceCardsSettings } from '../../models/defaultChoiceCards';
import { getChanges, VersionDiff } from '../../utils/defaultChoiceCards';
import {
  fetchFrontendSettingVersion,
  fetchFrontendSettingVersions,
  FrontendSettingsType,
} from '../../utils/requests';

export interface VersionHistoryItem {
  version: string;
  lastModified: string;
  isLatest: boolean;
  lastEditedBy?: string;
}

interface VersionedSettings {
  value: DefaultChoiceCardsSettings;
  version: string;
}

interface UseVersionHistoryResult {
  versions: VersionHistoryItem[] | null;
  loading: boolean;
  error: string | null;
  diffs: Record<string, VersionDiff | null>;
  diffLoading: string | null;
  visibleDiffVersions: Set<string>;
  loadVersions: () => Promise<void>;
  toggleDifferences: (versionId: string) => Promise<void>;
}

export const useVersionHistory = (): UseVersionHistoryResult => {
  const [versions, setVersions] = React.useState<VersionHistoryItem[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [diffs, setDiffs] = React.useState<Record<string, VersionDiff | null>>({});
  const [diffLoading, setDiffLoading] = React.useState<string | null>(null);
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

  return {
    versions,
    loading,
    error,
    diffs,
    diffLoading,
    visibleDiffVersions,
    loadVersions,
    toggleDifferences,
  };
};

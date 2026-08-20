import { ChoiceCard, ChoiceCardsSettings } from '../models/choiceCards';
import {
  ChoiceCardsDefaultsRegion,
  DefaultChoiceCardsSettings,
} from '../models/defaultChoiceCards';
import { regionIds, regions } from './models';

export type ChannelKey = 'epic' | 'banner';
export type FormData = ChoiceCardsSettings & { hasOneDefault: boolean };

export const REGION_ORDER: ChoiceCardsDefaultsRegion[] = ['Default', ...regionIds];
const EMPTY_SETTINGS: ChoiceCardsSettings = { choiceCards: [] };

export const countDefaultCards = (choiceCards: ChoiceCard[]): number =>
  choiceCards.filter((card) => card.isDefault).length;

export const sanitizeChoiceCardsSettings = (
  updatedSettings: ChoiceCardsSettings,
): ChoiceCardsSettings => ({
  choiceCards: updatedSettings.choiceCards.map((card) => ({
    ...card,
    pill: card.pill?.copy ? card.pill : undefined,
  })),
});

const buildDefaultData = (
  settings?: Partial<Record<ChoiceCardsDefaultsRegion, ChoiceCardsSettings>>,
): Record<ChoiceCardsDefaultsRegion, ChoiceCardsSettings> =>
  REGION_ORDER.reduce(
    (acc, region) => ({
      ...acc,
      [region]: settings?.[region] ?? EMPTY_SETTINGS,
    }),
    {} as Record<ChoiceCardsDefaultsRegion, ChoiceCardsSettings>,
  );

export const normalizeSettings = (
  data: DefaultChoiceCardsSettings,
): DefaultChoiceCardsSettings => ({
  epic: buildDefaultData(data.epic),
  banner: buildDefaultData(data.banner),
  lastEditedBy: data.lastEditedBy ?? '',
});

export const buildLabel = (region: ChoiceCardsDefaultsRegion): string =>
  region === 'Default' ? 'Default fallback' : regions[region];

export interface FlattenedChange {
  path: string;
  type: 'add' | 'remove' | 'update';
  oldValue?: unknown;
  value?: unknown;
}

export interface VersionDiff {
  previousVersionId: string;
  changes: FlattenedChange[];
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const valuesAreEqual = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) {
    return true;
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((value, index) => valuesAreEqual(value, right[index]))
    );
  }
  if (isObject(left) && isObject(right)) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    return [...keys].every((key) => valuesAreEqual(left[key], right[key]));
  }
  return false;
};

export const getChanges = (
  previous: unknown,
  current: unknown,
  parentPath = '',
): FlattenedChange[] => {
  if (valuesAreEqual(previous, current)) {
    return [];
  }

  if (Array.isArray(previous) && Array.isArray(current)) {
    const changes: FlattenedChange[] = [];
    const length = Math.max(previous.length, current.length);
    for (let index = 0; index < length; index += 1) {
      changes.push(...getChanges(previous[index], current[index], `${parentPath}[${index}]`));
    }
    return changes;
  }

  if (isObject(previous) && isObject(current)) {
    const changes: FlattenedChange[] = [];
    const keys = new Set([...Object.keys(previous), ...Object.keys(current)]);
    for (const key of keys) {
      if (key === 'lastEditedBy') {
        continue;
      }
      const path = parentPath ? `${parentPath}.${key}` : key;
      changes.push(...getChanges(previous[key], current[key], path));
    }
    return changes;
  }

  if (previous === undefined) {
    return [{ path: parentPath, type: 'add', value: current }];
  }
  if (current === undefined) {
    return [{ path: parentPath, type: 'remove', oldValue: previous }];
  }
  return [{ path: parentPath, type: 'update', oldValue: previous, value: current }];
};

export const formatChangeValue = (value: unknown): string => {
  if (value === undefined) {
    return '-';
  }
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
};

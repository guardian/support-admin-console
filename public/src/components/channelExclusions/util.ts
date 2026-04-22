import type { ExclusionRule, ExclusionSettings } from '../../models/exclusions';

export type ChannelKey = keyof ExclusionSettings;

export const makeRuleKey = (channel: ChannelKey, index: number): string => `${channel}:${index}`;

export const getIndexesForChannel = (keys: Set<string>, channel: ChannelKey): number[] =>
  Array.from(keys)
    .filter((key) => key.startsWith(`${channel}:`))
    .map((key) => Number(key.split(':')[1]))
    .filter((index) => Number.isInteger(index));

export const remapRuleKeysAfterRemoval = (
  keys: Set<string>,
  channel: ChannelKey,
  removedIndex: number,
): Set<string> => {
  const nextKeys = new Set<string>();

  keys.forEach((key) => {
    const [keyChannel, rawIndex] = key.split(':');
    const index = Number(rawIndex);

    if (keyChannel !== channel || !Number.isInteger(index)) {
      nextKeys.add(key);
      return;
    }

    if (index === removedIndex) {
      return;
    }

    if (index > removedIndex) {
      nextKeys.add(makeRuleKey(channel, index - 1));
      return;
    }

    nextKeys.add(key);
  });

  return nextKeys;
};

export const validateRule = (
  rule: ExclusionRule,
  channelLabel: string,
  ruleIndex: number,
): string | null => {
  if (!rule.name?.trim()) {
    return `${channelLabel}: Rule ${ruleIndex + 1} name is required.`;
  }

  if (rule.dateRange) {
    const { start, end } = rule.dateRange;

    if (!start || !end) {
      return `${channelLabel}: Rule ${ruleIndex + 1} must include both start and end dates.`;
    }

    if (start > end) {
      return `${channelLabel}: Rule ${ruleIndex + 1} has an invalid date range (start is after end).`;
    }
  }

  return null;
};

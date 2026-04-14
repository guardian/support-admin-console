import { getIndexesForChannel, makeRuleKey, remapRuleKeysAfterRemoval, validateRule } from './util';

describe('channelExclusions util', () => {
  describe('makeRuleKey', () => {
    it('builds a key from channel and index', () => {
      expect(makeRuleKey('epic', 3)).toEqual('epic:3');
    });
  });

  describe('getIndexesForChannel', () => {
    it('returns only indexes for the requested channel', () => {
      const keys = new Set<string>(['epic:0', 'banner:2', 'epic:5', 'header:1']);

      expect(getIndexesForChannel(keys, 'epic')).toEqual([0, 5]);
    });

    it('filters out non-integer indexes', () => {
      const keys = new Set<string>(['epic:0', 'epic:foo', 'epic:1.2', 'epic:7']);

      expect(getIndexesForChannel(keys, 'epic')).toEqual([0, 7]);
    });
  });

  describe('remapRuleKeysAfterRemoval', () => {
    it('removes deleted index and shifts higher indexes for the same channel', () => {
      const keys = new Set<string>(['epic:0', 'epic:1', 'epic:3', 'banner:2']);

      const result = remapRuleKeysAfterRemoval(keys, 'epic', 1);

      expect(Array.from(result).sort()).toEqual(['banner:2', 'epic:0', 'epic:2']);
    });

    it('keeps keys unchanged for other channels', () => {
      const keys = new Set<string>(['banner:0', 'header:4']);

      const result = remapRuleKeysAfterRemoval(keys, 'epic', 1);

      expect(Array.from(result).sort()).toEqual(['banner:0', 'header:4']);
    });
  });

  describe('validateRule', () => {
    it('returns error when rule name is missing', () => {
      const result = validateRule({ name: '   ' }, 'Epic', 0);

      expect(result).toEqual('Epic: Rule 1 name is required.');
    });

    it('returns error when dateRange has missing boundaries', () => {
      const result = validateRule(
        {
          name: 'test',
          dateRange: {
            start: '2026-03-01',
            end: '',
          },
        },
        'Banner',
        2,
      );

      expect(result).toEqual('Banner: Rule 3 must include both start and end dates.');
    });

    it('returns error when dateRange is invalid', () => {
      const result = validateRule(
        {
          name: 'test',
          dateRange: {
            start: '2026-04-10',
            end: '2026-04-01',
          },
        },
        'Header',
        1,
      );

      expect(result).toEqual('Header: Rule 2 has an invalid date range (start is after end).');
    });

    it('returns null for a valid rule', () => {
      const result = validateRule(
        {
          name: 'valid',
          dateRange: {
            start: '2026-03-01',
            end: '2026-03-10',
          },
        },
        'Gutter Ask',
        0,
      );

      expect(result).toBeNull();
    });
  });
});

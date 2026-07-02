import { buildChartData, isWithinSchedule, parseSchedulerUtc } from './utilities';

describe('buildChartData', () => {
  it('formats timestamps in 24-hour format', () => {
    const samples = [
      {
        timestamp: '2024-07-28T03:00:00Z',
        variants: [
          { variantName: 'A', views: 10, mean: 0.3 },
          { variantName: 'B', views: 12, mean: 0.5 },
        ],
      },
      {
        timestamp: '2024-07-28T15:00:00Z',
        variants: [
          { variantName: 'A', views: 15, mean: 0.6 },
          { variantName: 'B', views: 13, mean: 0.2 },
        ],
      },
    ];

    const result = buildChartData(samples, ['A', 'B'], 'views');
    expect(result).toEqual([
      {
        dateHour: '2024-07-28 03:00',
        A: 10,
        B: 12,
      },
      {
        dateHour: '2024-07-28 15:00',
        A: 15,
        B: 13,
      },
    ]);
  });

  it('sets variant values to null if variants array is empty', () => {
    const samples = [
      {
        timestamp: '2024-07-28T04:00:00Z',
        variants: [],
      },
    ];
    const result = buildChartData(samples, ['A', 'B'], 'mean');
    expect(result).toEqual([
      {
        dateHour: '2024-07-28 04:00',
        A: null,
        B: null,
      },
    ]);
  });
});

describe('parseSchedulerUtc', () => {
  it('returns null for undefined', () => {
    expect(parseSchedulerUtc(undefined)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseSchedulerUtc('')).toBeNull();
  });

  it('returns null for an invalid date string', () => {
    expect(parseSchedulerUtc('not-a-date')).toBeNull();
  });

  it('parses a valid YYYY-MM-DDTHH:MM string as UTC', () => {
    const result = parseSchedulerUtc('2026-07-15T14:30');
    expect(result).not.toBeNull();
    expect(result?.toISOString()).toBe('2026-07-15T14:30:00.000Z');
  });
});

describe('isWithinSchedule', () => {
  const PAST = '2020-01-01T00:00';
  const FUTURE = '2099-12-31T23:59';

  it('returns true when no start or end is set', () => {
    expect(isWithinSchedule({})).toBe(true);
  });

  it('returns true when only start is set and now is after start', () => {
    expect(isWithinSchedule({ start: PAST })).toBe(true);
  });

  it('returns false when only start is set and now is before start', () => {
    expect(isWithinSchedule({ start: FUTURE })).toBe(false);
  });

  it('returns true when only end is set and now is before end', () => {
    expect(isWithinSchedule({ end: FUTURE })).toBe(true);
  });

  it('returns false when only end is set and now is after end', () => {
    expect(isWithinSchedule({ end: PAST })).toBe(false);
  });

  it('returns true when now is within start and end', () => {
    expect(isWithinSchedule({ start: PAST, end: FUTURE })).toBe(true);
  });

  it('returns false when now is before start', () => {
    expect(isWithinSchedule({ start: FUTURE, end: FUTURE })).toBe(false);
  });

  it('returns false when now is after end', () => {
    expect(isWithinSchedule({ start: PAST, end: PAST })).toBe(false);
  });
});

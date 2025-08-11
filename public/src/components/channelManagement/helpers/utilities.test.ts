import { buildChartData } from './utilities';

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

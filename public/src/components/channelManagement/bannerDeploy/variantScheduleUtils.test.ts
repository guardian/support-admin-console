import { toggleWeekday, weekdays } from './variantScheduleUtils';

describe('variant banner schedule utilities', () => {
  it('lists each weekday using the persisted index order', () => {
    expect(weekdays.map(({ day }) => day)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('adds a selected day and keeps the saved indices ordered', () => {
    expect(toggleWeekday([1, 2, 4, 5, 6], 3, true)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('removes the selected day and supports an empty schedule', () => {
    expect(toggleWeekday([0], 0, false)).toEqual([]);
  });
});

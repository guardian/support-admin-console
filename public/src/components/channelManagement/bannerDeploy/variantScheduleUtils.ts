export const weekdays = [
  { day: 0, label: 'Sunday' },
  { day: 1, label: 'Monday' },
  { day: 2, label: 'Tuesday' },
  { day: 3, label: 'Wednesday' },
  { day: 4, label: 'Thursday' },
  { day: 5, label: 'Friday' },
  { day: 6, label: 'Saturday' },
];

export const toggleWeekday = (
  selectedDays: number[],
  day: number,
  isSelected: boolean,
): number[] => {
  const days = new Set(selectedDays);
  if (isSelected) {
    days.add(day);
  } else {
    days.delete(day);
  }
  return [...days].sort((first, second) => first - second);
};

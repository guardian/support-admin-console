import { useEffect, useState } from 'react';
import {addDays, format} from "date-fns";

function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function toDateHourString(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:00:00.000');
}

export interface SuperModeRow {
  url: string;
  region: string;
  startTimestamp: string;
  endTimestamp: string;
  avPerView: number;
}

export const useSuperModeRows = (): SuperModeRow[] => {
  const [rows, setRows] = useState<SuperModeRow[]>([]);

  const now = new Date();
  const tomorrow = addDays(now, 1);
  // Ideally this would be done serverside, but java dates are a pain!
  const todayDate = toDateString(now);
  const tomorrowDate = toDateString(tomorrow);
  const endTimestamp = toDateHourString(now);

  useEffect(() => {
    fetch(
      `/frontend/super-mode?endTimestamp=${endTimestamp}&todayDate=${todayDate}&tomorrowDate=${tomorrowDate}`,
    )
      .then(resp => resp.json())
      .then(rows => setRows(rows));
  }, []);

  return rows;
};

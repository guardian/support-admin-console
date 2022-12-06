import { useEffect, useState } from 'react';

export interface SuperModeRow {
  url: string;
  region: string;
  startTimestamp: string;
  endTimestamp: string;
  avPerView: number;
}

export const useSuperModeRows = (): SuperModeRow[] => {
  const [rows, setRows] = useState<SuperModeRow[]>([]);

  useEffect(() => {
    fetch(`/frontend/super-mode`)
      .then(resp => resp.json())
      .then(rows => setRows(rows));
  }, []);

  return rows;
};

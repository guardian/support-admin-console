import { useEffect, useState } from 'react';

export interface SuperModeRow {
  url: string;
  region: string;
  startTimestamp: string;
  endTimestamp: string;
  avPerView: number;
  totalAcquisitions?: number;
}

export const useSuperModeRows = (): SuperModeRow[] => {
  const [rows, setRows] = useState<SuperModeRow[]>([]);

  useEffect(() => {
    void fetch(`/frontend/super-mode`)
      .then((resp) => resp.json())
      .then((rows) => setRows(rows as SuperModeRow[]));
  }, []);

  return rows;
};

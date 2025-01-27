import { useEffect, useState } from 'react';

export interface ArchivedTestsRow {
  channel: string;
  name: string;
  nickname: string;
  priority: number;
  campaignName: string;
  consentStatus: string[];
  contextTargeting: string;
  isBanditTest: boolean;
  locations: string[];
  methodologies: string[];
  signedInStatus: string;
  userCohort: string;
  variants: string[];
}

export const useArchivedTestsRows = (): ArchivedTestsRow[] => {
  const [rows, setRows] = useState<ArchivedTestsRow[]>([]);

  useEffect(() => {
    fetch(`/frontend/archived-tests`)
      .then(resp => resp.json())
      .then(rows => setRows(rows));
  }, []);

  return rows;
};

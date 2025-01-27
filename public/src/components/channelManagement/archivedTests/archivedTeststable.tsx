import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ArchivedTestsRow } from './useArchivedTestRow';

interface ArchivedTestsTableProps {
  rows: ArchivedTestsRow[];
}

export const ArchivedTestsTable: React.FC<ArchivedTestsTableProps> = ({
  rows,
}: ArchivedTestsTableProps) => {
  const columns: GridColDef[] = [
    { field: 'channel', headerName: 'Channel', width: 120 },
    { field: 'name', headerName: 'Name', width: 120 },
    { field: 'nickName', headerName: 'Nick Name', width: 200 },
    { field: 'priority', headerName: 'Priority', type: 'number', width: 200 },
    {
      field: 'campaignName',
      headerName: 'Campaign Name',
      width: 100,
    },
    {
      field: 'consentStatus',
      headerName: 'Consent Status',
      width: 100,
    },
    {
      field: 'contextTargeting',
      headerName: 'Context Targeting',
      width: 100,
    },
    {
      field: 'isBanditTest',
      headerName: 'Bandit Test?',
      type: 'boolean',
      width: 120,
    },
    {
      field: 'locations',
      headerName: 'Locations',
      type: 'boolean',
      width: 120,
    },
    {
      field: 'methodologies',
      headerName: 'Methodologies',
      width: 120,
    },
    {
      field: 'signedInStatus',
      headerName: 'SignedIn Status',
      width: 120,
    },
    {
      field: 'userCohort',
      headerName: 'User Cohort',
      width: 120,
    },
    {
      field: 'variants',
      headerName: 'Variants',
      width: 120,
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        autoHeight
        rows={rows.map(row => ({ ...row, id: `${row.channel}/${row.name}` }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
};

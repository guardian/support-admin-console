import { SuperModeRow } from './useSuperModeRows';
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface SuperModeTableProps {
  rows: SuperModeRow[];
}

export const SuperModeTable: React.FC<SuperModeTableProps> = ({ rows }: SuperModeTableProps) => {
  const columns: GridColDef[] = [
    { field: 'url', headerName: 'Article', flex: 1 },
    { field: 'region', headerName: 'Region', width: 120 },
    { field: 'startTimestamp', headerName: 'Start', width: 200 },
    { field: 'endTimestamp', headerName: 'End', width: 200 },
    {
      field: 'avPerView',
      headerName: '£AV/view',
      type: 'number',
      width: 100,
    },
    {
      field: 'totalViews',
      headerName: 'Views',
      type: 'number',
      width: 100,
    },
    {
      field: 'totalAv',
      headerName: '£AV',
      type: 'number',
      width: 100,
    },
    {
      field: 'totalAcquisitions',
      headerName: 'Acquisitions',
      type: 'number',
      width: 120,
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        autoHeight
        rows={rows.map((row) => ({ ...row, id: `${row.url}/${row.region}` }))}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10]}
      />
    </div>
  );
};

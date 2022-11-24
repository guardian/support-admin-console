import { SuperModeRow } from './useSuperModeRows';
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface SuperModeTableProps {
  rows: SuperModeRow[];
  setSelectedRow: (row: SuperModeRow) => void;
}

export const SuperModeTable: React.FC<SuperModeTableProps> = ({
  rows,
  setSelectedRow,
}: SuperModeTableProps) => {
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
  ];

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        autoHeight
        rows={rows.map(row => ({ ...row, id: `${row.url}/${row.region}` }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        onRowDoubleClick={params => {
          const row = params.row as SuperModeRow;
          setSelectedRow(row);
        }}
      />
    </div>
  );
};

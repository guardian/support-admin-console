import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IChange } from 'json-diff-ts';

interface AuditDisplayTableProps {
  jsonDiff: IChange[];
}

export const AuditDisplayTable: React.FC<AuditDisplayTableProps> = ({
  jsonDiff,
}: AuditDisplayTableProps) => {
  const columns: GridColDef[] = [
    { field: 'key', headerName: 'Key', width: 250 },
    { field: 'type', headerName: 'Type', width: 120 },
    {
      field: 'value',
      headerName: 'Current Value',
      width: 120,
    },
    {
      field: 'oldValue',
      headerName: 'Old Value',
      width: 200,
    },
    {
      field: 'changes',
      headerName: 'Changes',
      valueFormatter: params => {
        if (!params.value) {
          return '';
        }

        return JSON.stringify(params.value);
      },
      width: 700,
    },
    {
      field: 'nestedChanges',
      headerName: 'Nested Changes',
      valueFormatter: params => {
        if (!params.value) {
          return '';
        }
        return JSON.stringify(params.value);
      },
      width: 700,
    },
    {
      field: 'furtherNestedChanges',
      headerName: 'Further Nested Changes',
      valueFormatter: params => {
        if (!params.value) {
          return '';
        }
        return JSON.stringify(params.value);
      },
      width: 700,
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        autoHeight
        rows={jsonDiff.map(row => ({
          id: `${row.key}/${row.oldValue}}`,
          key: `${row.key}`,
          type: `${row.type}`,
          // value: `${row.value === undefined ? '' : row.value}`,
          // oldValue: `${row.oldValue === undefined ? '' : row.oldValue}`,
          changes: row.changes,
          nestedChanges: row.changes?.map(e => e.changes),
          furtherNestedChanges: row.changes?.map(e => e.changes?.map(row => row.changes)),
        }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
};

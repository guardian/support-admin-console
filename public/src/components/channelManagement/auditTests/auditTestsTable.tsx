import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({}: Theme) => ({
  heading: {
    margin: '6px 12px 0 12px',
    fontSize: 18,
    fontWeight: 500,
  },
  container: {
    marginTop: '10px',
  },
}));

export interface AuditDataRow {
  name: string;
  channel: string;
  ttlInSecondsSinceEpoch: number;
  userEmail: string;
  timestamp: string;
}

interface AuditTestsTableProps {
  testName: string;
  rows: AuditDataRow[];
}

export const AuditTestsTable: React.FC<AuditTestsTableProps> = ({
  testName,
  rows,
}: AuditTestsTableProps) => {
  const classes = useStyles();

  const columns: GridColDef[] = [
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      valueFormatter: params => {
        if (!params.value) {
          return '';
        }
        const date = new Date(params.value);
        return date.toLocaleString();
      },
      width: 200,
    },
    { field: 'userEmail', headerName: 'User Email', width: 250 },
    {
      field: 'action',
      headerName: 'Compare',
      sortable: false,
      renderCell: params => {
        const onClick = () => {
          console.log('Compare', params.row);
        };

        return <Button onClick={onClick}>Compare</Button>;
      },
    },
  ];

  return (
    <>
      <div className={classes.container}>
        <Typography className={classes.heading}> Audit Details for {testName} </Typography>
        <div style={{ width: '100%' }}>
          <DataGrid
            autoHeight
            rows={rows.map(row => ({ ...row, id: `${row.timestamp}` }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </div>
      </div>
    </>
  );
};

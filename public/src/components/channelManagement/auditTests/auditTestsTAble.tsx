import React, { useEffect, useState } from 'react';
import { AuditDataRow } from './AuditTestsButton';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Theme, Typography } from '@mui/material';
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

interface AuditTestsTableProps {
  testName: string;
  channel: string;
}

export const AuditTestsTable: React.FC<AuditTestsTableProps> = ({
  testName,
  channel,
}: AuditTestsTableProps) => {
  const classes = useStyles();
  const [rows, setRows] = useState<AuditDataRow[]>([]);

  useEffect(() => {
    fetch(`/frontend/audit/${channel}/${testName}`)
      .then(resp => resp.json())
      .then(rows => setRows(rows));
  }, [testName, channel]);

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
      field: 'channelAndName',
      headerName: 'Test Name',
      valueFormatter: params => {
        return params.value;
      },
    },
    { field: 'channel', headerName: 'Channel', width: 120 },
  ];

  return (
    <>
      <div className={classes.container}>
        <Typography className={classes.heading}> Audit Test Details for {testName} </Typography>
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

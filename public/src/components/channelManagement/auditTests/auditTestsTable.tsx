import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { diff, IChange } from 'json-diff-ts';
import { AuditTestCompareVersionsDialog } from './auditTestCompareVersionsDialog';

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
  item: never;
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

  const [open, setOpen] = React.useState(false);
  const [jsonDiff, setJsonDiff] = React.useState<IChange[]>([]);

  const sortedRows = [...rows].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const getJsonDiff = (version: number): IChange[] => {
    const currentVersion = sortedRows[version].item;
    const previousVersion = sortedRows[version + 1].item;
    return diff(previousVersion, currentVersion, {
      embeddedObjKeys: { variants: 'name', 'regionTargeting.targetedCountryGroups': '$value' },
      keysToSkip: ['lockStatus'],
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'displayedIndex',
      headerName: 'Index',
      type: 'number',
      width: 20,
    },
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
          const version: number = +params.row.index;
          const jsonDiff = getJsonDiff(version);
          setOpen(true);
          setJsonDiff(jsonDiff);
        };
        //To hide and disable  the button for the last row
        if (params.row.index === (sortedRows.length - 1).toString()) {
          return <Button disabled></Button>;
        }
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
            rows={sortedRows.map(row => ({
              ...row,
              id: `${row.timestamp}`,
              index: `${sortedRows.indexOf(row)}`,
              displayedIndex: `${sortedRows.length - sortedRows.indexOf(row)}`, // to display the index in reverse order
            }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </div>
        {open && (
          <div>
            <AuditTestCompareVersionsDialog jsonDiff={jsonDiff} open={open} setOpen={setOpen} />
          </div>
        )}
      </div>
    </>
  );
};

import { makeStyles } from '@mui/styles';
import { Button, Theme } from '@mui/material';
import React, { useState } from 'react';
import { AuditTestsTable } from './auditTestsTAble';
const useStyles = makeStyles(({}: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  auditButton: {
    height: '100%',
  },
  heading: {
    margin: '6px 12px 0 12px',
    fontSize: 18,
    fontWeight: 500,
  },
  tableContainer: {
    width: '100%',
  },
}));

interface AuditTestsButtonProps {
  testName: string;
  channel: string;
}

export interface AuditDataRow {
  name: string;
  channel: string;
  ttlInSecondsSinceEpoch: number;
  userEmail: string;
  timestamp: string;
}

export const AuditTestsButton: React.FC<AuditTestsButtonProps> = ({
  testName,
  channel,
}: AuditTestsButtonProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.auditButton}>
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Get Audit Data
          </Button>
        </div>
        <div className={classes.tableContainer}>
          {open && <AuditTestsTable testName={testName} channel={channel} />}
        </div>
      </div>
    </>
  );
};

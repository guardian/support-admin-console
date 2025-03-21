import { makeStyles } from '@mui/styles';
import { Button, Theme, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AuditTestsTable } from './auditTestsTAble';
const useStyles = makeStyles(({}: Theme) => ({
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
      <Button className={classes.auditButton} variant="outlined" onClick={() => setOpen(true)}>
        Get Audit Data
      </Button>
      <div className={classes.tableContainer}>
        {open && <AuditTestsTable testName={testName} channel={channel} />}
      </div>
    </>
  );
};

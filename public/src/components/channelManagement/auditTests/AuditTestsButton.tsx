import { makeStyles } from '@mui/styles';
import { Button, Theme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LockStatus, Methodology, Status } from '../helpers/shared';
import { SuperModeRow, useSuperModeRows } from '../superMode/useSuperModeRows';
import { SuperModeTable } from '../superMode/superModeTable';
import useOpenable from '../../../hooks/useOpenable';
import { AuditTestsTable } from './auditTestsTAble';

const useStyles = makeStyles(({}: Theme) => ({
  dialog: {
    padding: '10px',
  },
  auditButton: {
    height: '100%',
  },
  heading: {
    margin: '6px 12px 0 12px',
    fontSize: 18,
    fontWeight: 500,
  },
  chartContainer: {
    margin: '12px',
  },
}));

interface AuditTestsButtonProps {
  testName: string;
  channel: string;
}

export interface AuditDataRow {
  name: string;
  channel: string;
  status?: Status;
  lockStatus?: LockStatus;
  priority?: number;
  campaignName?: string;
  methodologies: Methodology[];
  ttlInSecondsSinceEpoch: number;
}

export const getAuditTableRows = (testName: string, channel: string): AuditDataRow[] => {
  const [rows, setRows] = useState<AuditDataRow[]>([]);
  useEffect(() => {
    fetch(`/frontend/audit/${channel}/${testName}`)
      .then(resp => resp.json())
      .then(rows => setRows(rows));
  }, [testName, channel]);
  return rows;
};

export const AuditTestsButton: React.FC<AuditTestsButtonProps> = ({
  testName,
  channel,
}: AuditTestsButtonProps) => {
  const classes = useStyles();
  const rows = getAuditTableRows(testName, channel);
  return (
    <>
      <Button
        className={classes.auditButton}
        variant="outlined"
        onClick={() => getAuditTableRows(testName, channel)}
      >
        Get Audit Data
      </Button>

      <AuditTestsTable rows={rows} />
    </>
  );
};

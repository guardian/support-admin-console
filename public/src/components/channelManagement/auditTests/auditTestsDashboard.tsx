import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSuperModeRows } from '../superMode/useSuperModeRows';
import { SuperModeTable } from '../superMode/superModeTable';

const useStyles = makeStyles(() => ({
  container: {
    margin: '10px',
  },
  info: {
    fontSize: '14px',
    marginBottom: '10px',
    fontWeight: 500,
    textAlign: 'right',
  },
}));

export const AuditTestsDashboard: React.FC = () => {
  const classes = useStyles();

  const rows = useSuperModeRows();

  return (
    <div className={classes.container}>
      <div>
        <Typography variant={'h3'} className={classes.info}>
          Data is from the 3-hour window leading up to an article becoming &apos;Super&apos; in the
          given region.
        </Typography>
      </div>
      <SuperModeTable rows={rows} />
    </div>
  );
};

import React from 'react';
import { makeStyles } from '@mui/styles';
import { ArchivedTestsTable } from './archivedTeststable';
import { useArchivedTestsRows } from './useArchivedTestRow';

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

export const ArchivedTestsDashboard: React.FC = () => {
  const classes = useStyles();

  const rows = useArchivedTestsRows();

  return (
    <div className={classes.container}>
      <ArchivedTestsTable rows={rows} />
    </div>
  );
};

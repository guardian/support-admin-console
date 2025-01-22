import React from 'react';
import { makeStyles } from '@mui/styles';
import { useSuperModeRows } from './useSuperModeRows';
import { SuperModeTable } from './superModeTable';

const useStyles = makeStyles(() => ({
  container: {
    margin: '10px',
  },
}));

export const SuperModeDashboard: React.FC = () => {
  const classes = useStyles();

  const rows = useSuperModeRows();

  return (
    <div className={classes.container}>
      <SuperModeTable rows={rows} />
    </div>
  );
};

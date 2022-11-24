import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { SuperModeRow, useSuperModeRows } from './useSuperModeRows';
import { ArticleDataChartDialog } from './articleDataChart';
import { SuperModeTable } from './superModeTable';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    margin: '10px',
  },
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
}));

export const SuperModeDashboard: React.FC = () => {
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState<SuperModeRow | null>(null);

  const rows = useSuperModeRows();

  return (
    <div className={classes.container}>
      <SuperModeTable rows={rows} setSelectedRow={setSelectedRow} />
      <ArticleDataChartDialog row={selectedRow} onClose={() => setSelectedRow(null)} />
    </div>
  );
};

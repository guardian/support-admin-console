import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { SuperModeRow, useSuperModeRows } from './useSuperModeRows';
import { ArticleDataChartDialog } from './articleDataChart';
import { SuperModeTable } from './superModeTable';

const useStyles = makeStyles(() => ({
  container: {
    margin: '10px',
  },
  info: {
    fontSize: '14px',
    marginBottom: '10px',
    fontWeight: 500,
  },
}));

export const SuperModeDashboard: React.FC = () => {
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState<SuperModeRow | null>(null);

  const rows = useSuperModeRows();

  return (
    <div className={classes.container}>
      <div>
        <Typography variant={'h3'} className={classes.info}>
          Double click a row to see article data
        </Typography>
      </div>
      <SuperModeTable rows={rows} setSelectedRow={setSelectedRow} />
      <ArticleDataChartDialog row={selectedRow} onClose={() => setSelectedRow(null)} />
    </div>
  );
};

import React from 'react';

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import BannerChannelDeployer from './bannerChannelDeployer';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles(({ spacing }: Theme) => ({
  scrollableContainer: {
    overflow: 'auto',
  },
  container: {
    padding: `${spacing(6)} ${spacing(9)}`,

    '& > * + *': {
      marginTop: spacing(4),
    },
  },
  tableContainer: {
    width: '45%',
  },
}));

export type BannerChannel = 'CHANNEL1' | 'CHANNEL2';

const BannerDeployDashboard: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.scrollableContainer}>
      <div className={classes.container}>
        <div className={classes.tableContainer}>
          <BannerChannelDeployer channel="CHANNEL1" />
        </div>
        <div className={classes.tableContainer}>
          <BannerChannelDeployer channel="CHANNEL2" />
        </div>
      </div>
    </div>
  );
};

export default BannerDeployDashboard;

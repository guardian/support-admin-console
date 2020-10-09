import React from 'react';

import { Theme, withStyles, createStyles, WithStyles } from '@material-ui/core';

import BannerDeployeChannelDeployer from './bannerDeployChannelDeployer';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    scrollableContainer: {
      overflow: 'auto',
    },
    container: {
      padding: `${spacing(6)}px ${spacing(9)}px`,

      '& > * + *': {
        marginTop: spacing(4),
      },
    },
    tableContainer: {
      width: '45%',
    },
  });

export type BannerChannel = 'CHANNEL1' | 'CHANNEL2';

type BannerDeployDashboardProps = WithStyles<typeof styles>;

const BannerDeployDashboard: React.FC<BannerDeployDashboardProps> = ({
  classes,
}: BannerDeployDashboardProps) => {
  return (
    <div className={classes.scrollableContainer}>
      <div className={classes.container}>
        <div className={classes.tableContainer}>
          <BannerDeployeChannelDeployer channel="CHANNEL1" />
        </div>
        <div className={classes.tableContainer}>
          <BannerDeployeChannelDeployer channel="CHANNEL2" />
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(BannerDeployDashboard);

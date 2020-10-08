import React from 'react';

import {
  Checkbox,
  Paper,
  Theme,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  Typography,
  withStyles,
  createStyles,
  WithStyles,
} from '@material-ui/core';
import { BannerChannel } from './bannerDeployDashboard';
import { BannerDeploys } from './bannerDeployChannelDeployer';
import BannerDeployChannelDeployerTableRow from './bannerDeployChannelDeployerTableRow';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      '& > * + *': {
        marginTop: spacing(2),
      },
    },
  });

type BannerDeployChannelDeployerTableProps = WithStyles<typeof styles> & {
  channel: BannerChannel;
  bannerDeploys: BannerDeploys | null;
};

const BannerDeployChannelDeployerTable: React.FC<BannerDeployChannelDeployerTableProps> = ({
  channel,
  bannerDeploys,
}: BannerDeployChannelDeployerTableProps) => {
  const isChannel1 = channel === 'CHANNEL1';

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography variant="h6" id="tableTitle" component="div">
          {isChannel1 ? 'Banner 1' : 'Banner 2'}
        </Typography>
      </Toolbar>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>Region</TableCell>
            <TableCell>Last Deploy (UTC)</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bannerDeploys &&
            Object.keys(bannerDeploys).map(region => (
              <BannerDeployChannelDeployerTableRow
                key={region}
                region={region}
                timestamp={bannerDeploys[region as keyof BannerDeploys].timestamp}
                email={bannerDeploys[region as keyof BannerDeploys].email}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default withStyles(styles)(BannerDeployChannelDeployerTable);

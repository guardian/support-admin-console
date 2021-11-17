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
import { BannerDeploys, BannersToRedeploy } from './bannerDeployChannelDeployer';
import BannerDeployChannelDeployerTableRow from './bannerDeployChannelDeployerTableRow';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    schedule: {
      paddingLeft: spacing(3),
    },
  });

interface BannerDeployChannelDeployerTableProps extends WithStyles<typeof styles> {
  channel: BannerChannel;
  bannerDeploys?: BannerDeploys;
  bannersToRedeploy: BannersToRedeploy;
  onRedeployAllClick: (shouldRedeploy: boolean) => void;
  onRedeployClick: (region: string, shouldRedeploy: boolean) => void;
}

const BannerDeployChannelDeployerTable: React.FC<BannerDeployChannelDeployerTableProps> = ({
  channel,
  bannerDeploys,
  bannersToRedeploy,
  onRedeployAllClick,
  onRedeployClick,
  classes,
}: BannerDeployChannelDeployerTableProps) => {
  const isChannel1 = channel === 'CHANNEL1';
  const shouldRedeployAllBanners = Object.values(bannersToRedeploy).every(
    shouldRedeploy => shouldRedeploy,
  );

  const Schedule = (): JSX.Element => (
    <div className={classes.schedule}>
      This banner is automatically deployed at:
      {isChannel1 ? (
        <ul>
          <li>9am every Sunday</li>
        </ul>
      ) : (
        <ul>
          <li>8am every Monday</li>
          <li>8am every Friday</li>
        </ul>
      )}
    </div>
  );

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography variant="h6" id="tableTitle" component="div">
          {isChannel1 ? 'Banner 1' : 'Banner 2'}
        </Typography>
      </Toolbar>
      <Schedule />
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={shouldRedeployAllBanners}
                onChange={(event): void => onRedeployAllClick(event.target.checked)}
              />
            </TableCell>
            <TableCell>Region</TableCell>
            <TableCell>Last Manual Deploy (UTC)</TableCell>
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
                shouldRedeploy={bannersToRedeploy[region as keyof BannersToRedeploy]}
                onRedeployClick={(shouldRedeploy: boolean): void =>
                  onRedeployClick(region, shouldRedeploy)
                }
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default withStyles(styles)(BannerDeployChannelDeployerTable);
